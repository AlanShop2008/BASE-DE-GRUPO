const handler = async (m, { conn, text, participants }) => {
  const mentions = participants.map(p => p.id)

  // Si respondes a un mensaje viejo con .n
  if (m.quoted) {
    try {
      let q = m.quoted

      // Reenviar el mensaje citado tal cual
      await conn.copyNForward(
        m.chat,
        q.fakeObj || q,
        true,
        {
          contextInfo: {
            mentionedJid: mentions
          }
        }
      )

      return
    } catch (e) {
      console.error(e)

      // Si copyNForward falla, intenta reenviar texto citado
      let quotedText = m.quoted.text || m.quoted.caption || ''

      if (quotedText) {
        return conn.sendMessage(
          m.chat,
          {
            text: quotedText,
            mentions
          },
          { quoted: m }
        )
      }

      return conn.reply(m.chat, '❌ No pude reenviar ese mensaje.', m)
    }
  }

  // Si usas .n texto
  if (text) {
    return conn.sendMessage(
      m.chat,
      {
        text,
        mentions
      },
      { quoted: m }
    )
  }

  return conn.reply(
    m.chat,
    `⚠️ Uso correcto:\n\n.n texto\n\nO responde a un mensaje pasado con:\n.n`,
    m
  )
}

handler.help = ['n <texto>']
handler.tags = ['group']
handler.command = /^n$/i
handler.admin = true
handler.group = true

export default handler
