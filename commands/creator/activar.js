const handler = async (m, { conn, command }) => {
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  let chat = global.db.data.chats[m.chat]

  if (command === 'desactivar') {
    chat.botOff = true
    return conn.reply(m.chat, '🔴 Bot desactivado en este grupo.', m)
  }

  if (command === 'activar') {
    chat.botOff = false
    return conn.reply(m.chat, '🟢 Bot activado nuevamente.', m)
  }
}

handler.help = ['activar', 'desactivar']
handler.tags = ['creator']
handler.command = /^(activar|desactivar)$/i
handler.owner = true

export default handler
