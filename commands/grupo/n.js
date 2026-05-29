const handler = async (m, { conn, text, participants }) => {
  const mentions = participants.map(p => p.id)

  // Si respondes a un mensaje con .n
  if (m.quoted) {
    try {
      await conn.copyNForward(m.chat, m.quoted.fakeObj || m.quoted, true, {
        contextInfo: {
          mentionedJid: mentions
        }
      })
      return
    } catch (e) {
      console.log(e)
    }
  }

  // Si escribes .n texto
  if (text) {
    return conn.sendMessage(m.chat, {
      text,
      mentions
    }, { quoted: m })
  }

  return conn.reply(
    m.chat,
    `⚠️ Uso correcto:\n\n.n texto\n\nO responde a cualquier mensaje con:\n.n`,
    m
  )
}

handler.help = ['n <texto>']
handler.tags = ['group']
handler.command = /^n$/i
handler.admin = true
handler.group = true

export default handler
