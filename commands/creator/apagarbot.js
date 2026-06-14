let handler = async (m, { command, usedPrefix }) => {
  if (!m.isGroup) throw '❌ Este comando solo se puede usar en grupos.'
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  let chat = global.db.data.chats[m.chat]

  if (command == 'apagarbot') {
    chat.botApagado = true
    return m.reply(`✅ *Bot apagado en este grupo*

Ya no responderé comandos aquí para evitar spam.

Para volver a activarme usa:
*${usedPrefix}prenderbot*`)
  }

  if (command == 'prenderbot') {
    chat.botApagado = false
    return m.reply(`✅ *Bot activado nuevamente*

Ya puedo responder comandos en este grupo.`)
  }
}

handler.help = ['apagarbot', 'prenderbot']
handler.tags = ['owner']
handler.command = ['apagarbot', 'prenderbot']
handler.owner = true

export default handler