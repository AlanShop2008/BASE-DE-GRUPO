let handler = async (m, { conn, args, isROwner }) => {
  if (!isROwner) return

  let id = args[0] || m.chat

  if (!id.endsWith('@g.us')) {
    return conn.reply(m.chat, '❌ Ese no parece ser un ID de grupo.\n\nEjemplo:\n.modoowner 120363xxxx@g.us', m)
  }

  global.db.data.chats[id] = global.db.data.chats[id] || {}
  global.db.data.chats[id].modoOwner = !global.db.data.chats[id].modoOwner

  let estado = global.db.data.chats[id].modoOwner ? 'activado' : 'desactivado'

  return conn.reply(
    m.chat,
    `✅ Modo Owner ${estado} para:\n${id}`,
    m
  )
}

handler.command = /^modoowner$/i
handler.owner = true

export default handler