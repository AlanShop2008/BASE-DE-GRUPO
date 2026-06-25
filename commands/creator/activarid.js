let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.')

  let id = args[0] || m.chat

  if (!id.endsWith('@g.us')) {
    return m.reply('❌ Ese ID no parece ser de grupo.\n\nEjemplo:\n.activarid 120363xxxx@g.us')
  }

  global.db.data.chats[id] = global.db.data.chats[id] || {}
  global.db.data.chats[id].botOff = false

  return m.reply(`✅ Bot activado nuevamente en:\n\n${id}\n\nYa puedo responder comandos en ese grupo.`)
}

handler.command = ['activarid']
handler.owner = true

export default handler
