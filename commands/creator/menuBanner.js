import fs from 'fs'
import path from 'path'

const BANNER_DIR = path.join(process.cwd(), 'storage', 'menu_banner')
const CONFIG_FILE = path.join(BANNER_DIR, 'banner.json')

function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return null
    return JSON.parse(fs.readFileSync(CONFIG_FILE))
  } catch {
    return null
  }
}

export async function sendMenuConBanner(conn, m, menuText, quoted = null) {
  const config = readConfig()

  if (!config || !config.path || !fs.existsSync(config.path)) {
    return conn.reply(m.chat, menuText, quoted || m)
  }

  const buffer = fs.readFileSync(config.path)

  if (config.type === 'image') {
    return conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: menuText,
        mimetype: config.mimetype || 'image/jpeg'
      },
      { quoted: quoted || m }
    )
  }

  if (config.type === 'gif') {
    return conn.sendMessage(
      m.chat,
      {
        video: buffer,
        caption: menuText,
        gifPlayback: true,
        mimetype: config.mimetype || 'video/mp4'
      },
      { quoted: quoted || m }
    )
  }

  if (config.type === 'video') {
    return conn.sendMessage(
      m.chat,
      {
        video: buffer,
        caption: menuText,
        mimetype: config.mimetype || 'video/mp4'
      },
      { quoted: quoted || m }
    )
  }

  if (config.type === 'sticker') {
    await conn.sendMessage(
      m.chat,
      {
        sticker: buffer
      },
      { quoted: quoted || m }
    )

    return conn.reply(m.chat, menuText, quoted || m)
  }

  return conn.reply(m.chat, menuText, quoted || m)
}
