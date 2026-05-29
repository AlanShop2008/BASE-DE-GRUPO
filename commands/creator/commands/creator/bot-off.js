export async function before(m, { isOwner, isROwner }) {
  if (!m.isGroup) return false

  let chat = global.db.data.chats[m.chat]
  if (!chat) return false

  if (chat.botOff && !isOwner && !isROwner) {
    return true
  }

  return false
}
