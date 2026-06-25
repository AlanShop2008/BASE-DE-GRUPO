let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.')

  let id = args[0] || m.chat

  if (!id.endsWith('@g.us')) {
    return m.reply('❌ Ese ID no parece ser de grupo.\n\nEjemplo:\n.desactivarid 120363xxxx@g.us')
  }

  global.db.data.chats[id] = global.db.data.chats[id] || {}
  global.db.data.chats[id].botOff = true

  return m.reply(`✅ Bot desactivado correctamente en:\n\n${id}\n\nAhora no responderé comandos en ese grupo.`)
}

handler.command = ['desactivarid']
handler.owner = true

export default handler
