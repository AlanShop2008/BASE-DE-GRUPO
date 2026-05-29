export async function before(m, { isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return false

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  let chat = global.db.data.chats[m.chat]
  let text = m.text || ''

  // Si el bot está apagado, no deja pasar nada
  if (chat.botOff) {
    // Solo el owner puede usar .activar
    if ((isOwner || isROwner) && /^[./#!]activar$/i.test(text.trim())) {
      return false
    }

    // Bloquea todos los comandos y mensajes
    return true
  }

  return false
}
