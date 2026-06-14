let handler = m => m

handler.before = async function (m, { usedPrefix }) {
  if (!m.isGroup) return

  let chat = global.db.data.chats[m.chat]
  if (!chat) return

  if (chat.botApagado) {
    let body = (m.text || '').toLowerCase()

    let comandosPermitidos = [
      `${usedPrefix}prenderbot`,
      '.prenderbot',
      '#prenderbot',
      '/prenderbot'
    ]

    if (comandosPermitidos.some(cmd => body.startsWith(cmd))) {
      return
    }

    return true
  }
}

export default handler