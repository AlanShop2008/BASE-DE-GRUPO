import { startSerbot } from '../../lib/serbot.js'

let handler = async (m, { conn }) => {
  try {
    let number = m.sender.split('@')[0]

    await conn.reply(
      m.chat,
      `⏳ Preparando tu *SERBOT ALAN SHOP*...\n\nEspera el código de vinculación.`,
      m
    )

    await startSerbot(conn, m, number)
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error al iniciar SERBOT.', m)
  }
}

handler.command = /^serbot$/i
handler.help = ['serbot']
handler.tags = ['jadibot']

export default handler
