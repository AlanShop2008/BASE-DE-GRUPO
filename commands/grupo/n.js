const handler = async (m, { conn, text, participants }) => {

  const mentions = participants.map(
    p => conn.decodeJid(p.id)
  )

  // 📢 Responder a un mensaje
  if (m.quoted) {

    const quoted = m.quoted

    const quotedText =
      quoted.text ||
      quoted.caption ||
      ''

    // Imagen
    if (quoted.mtype === 'imageMessage') {

      const media =
        await quoted.download?.()

      return conn.sendMessage(
        m.chat,
        {
          image: media,
          caption: quotedText,
          mentions
        },
        { quoted: m }
      )

    }

    // Video
    if (quoted.mtype === 'videoMessage') {

      const media =
        await quoted.download?.()

      return conn.sendMessage(
        m.chat,
        {
          video: media,
          caption: quotedText,
          mentions
        },
        { quoted: m }
      )

    }

    // Audio
    if (quoted.mtype === 'audioMessage') {

      const media =
        await quoted.download?.()

      return conn.sendMessage(
        m.chat,
        {
          audio: media,
          mimetype: 'audio/mp4',
          mentions
        },
        { quoted: m }
      )

    }

    // Sticker
    if (quoted.mtype === 'stickerMessage') {

      const media =
        await quoted.download?.()

      return conn.sendMessage(
        m.chat,
        {
          sticker: media,
          mentions
        },
        { quoted: m }
      )

    }

    // Texto
    return conn.sendMessage(
      m.chat,
      {
        text: quotedText,
        mentions
      },
      { quoted: m }
    )

  }

  // 📢 .n texto
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
    `⚠️ Uso correcto:

.n texto

o responde a cualquier mensaje con:

.n`,
    m
  )

}

handler.help = ['n <texto>']
handler.tags = ['group']
handler.command = /^n$/i
handler.admin = true
handler.group = true

export default handler
