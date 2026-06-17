import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, isOwner, isROwner }) => {
  try {
    if (!isOwner && !isROwner) {
      return conn.reply(m.chat, '🚫 Solo el dueño del bot puede usar este comando.', m)
    }

    if (!m.quoted) {
      return conn.reply(m.chat, '⚠️ Responde a una imagen con *.setbanner*', m)
    }

    const mime = m.quoted.mimetype || ''

    if (!mime.startsWith('image/')) {
      return conn.reply(m.chat, '⚠️ Debes responder a una imagen.', m)
    }

    const rutaCarpeta = './storage/img'
    const rutaBanner = path.join(rutaCarpeta, 'catalogo.png')

    if (!fs.existsSync(rutaCarpeta)) {
      fs.mkdirSync(rutaCarpeta, { recursive: true })
    }

    const media = await m.quoted.download()

    if (!media) {
      return conn.reply(m.chat, '❌ No pude descargar la imagen.', m)
    }

    if (fs.existsSync(rutaBanner)) {
      fs.unlinkSync(rutaBanner)
    }

    fs.writeFileSync(rutaBanner, media)

   await conn.reply(
  m.chat,
  '✅ Banner actualizado correctamente.',
  m
)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error al actualizar el banner:\n\n${e}`, m)
  }
}

handler.help = ['setbanner']
handler.tags = ['creator']
handler.command = /^setbanner$/i
handler.owner = true

export default handler
