import fs from 'fs'
import path from 'path'

const BANNER_DIR = path.join(process.cwd(), 'storage', 'menu_banner')
const CONFIG_FILE = path.join(BANNER_DIR, 'banner.json')

if (!fs.existsSync(BANNER_DIR)) {
  fs.mkdirSync(BANNER_DIR, { recursive: true })
}

function getExt(mime = '') {
  if (mime.includes('image/webp')) return 'webp'
  if (mime.includes('image/gif')) return 'gif'
  if (mime.includes('image/')) return 'jpg'
  if (mime.includes('video/')) return 'mp4'
  return 'bin'
}

function getType(mime = '', quoted = {}) {
  const isAnimatedSticker =
    quoted?.msg?.isAnimated ||
    quoted?.message?.stickerMessage?.isAnimated ||
    quoted?.isAnimated

  if (mime.includes('image/webp')) return 'sticker'
  if (mime.includes('image/gif')) return 'gif'
  if (mime.includes('video/')) return 'gif'
  if (mime.includes('image/')) return 'image'
  if (isAnimatedSticker) return 'sticker'

  return null
}

const handler = async (m, { conn, isOwner, isROwner }) => {
  try {
    if (!isOwner && !isROwner) {
      return conn.reply(m.chat, '🚫 Solo el dueño del bot puede usar este comando.', m)
    }

    if (!m.quoted) {
      return conn.reply(
        m.chat,
        `⚠️ Responde a una *imagen, GIF, video o sticker* con:\n\n*.setbanner*`,
        m
      )
    }

    const mime = m.quoted.mimetype || m.quoted.msg?.mimetype || ''

    if (!mime) {
      return conn.reply(
        m.chat,
        '⚠️ No detecté el tipo de archivo. Responde directamente a una imagen, GIF, video o sticker.',
        m
      )
    }

    const type = getType(mime, m.quoted)

    if (!type) {
      return conn.reply(
        m.chat,
        '⚠️ Solo puedes usar imagen, GIF, video o sticker como banner.',
        m
      )
    }

    if (typeof m.quoted.download !== 'function') {
      return conn.reply(m.chat, '❌ No pude descargar el archivo.', m)
    }

    const media = await m.quoted.download()

    if (!media) {
      return conn.reply(m.chat, '❌ No pude descargar el banner.', m)
    }

    for (const file of fs.readdirSync(BANNER_DIR)) {
      if (file.startsWith('banner.')) {
        try {
          fs.unlinkSync(path.join(BANNER_DIR, file))
        } catch {}
      }
    }

    const ext = getExt(mime)
    const filePath = path.join(BANNER_DIR, `banner.${ext}`)

    fs.writeFileSync(filePath, media)

    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify(
        {
          type,
          mimetype: mime,
          path: filePath,
          updatedAt: Date.now()
        },
        null,
        2
      )
    )

    const tipoNombre =
      type === 'image'
        ? 'imagen'
        : type === 'gif'
          ? 'GIF / video'
          : type === 'sticker'
            ? 'sticker'
            : 'archivo'

    await conn.reply(
      m.chat,
      `✅ Banner actualizado correctamente.

📌 Tipo guardado: *${tipoNombre}*

Ahora este banner se podrá usar en todos los menús.`,
      m
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error al actualizar el banner:\n\n${e.message || e}`, m)
  }
}

handler.help = ['setbanner']
handler.tags = ['creator']
handler.command = /^setbanner$/i
handler.owner = true

export default handler
