let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db.data.chats[m.chat] || {}
  const adminMode = chat.modoadmin

  if (m.isGroup) {
    if (adminMode && !isOwner && !isROwner && !isAdmin) {
      return false
    }

    if (!isBotAdmin) {
      return false
    }

    return true
  } else {
    if (isOwner || isROwner || isPrems) {
      return true
    }

    return false
  }
}

export default handler
