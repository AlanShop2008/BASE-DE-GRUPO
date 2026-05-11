import * as fs from 'fs';

async function crearFgrupo(conn, chat) {
  let groupName = await conn.getName(chat)
  let ppUrl
  try {
    ppUrl = await conn.profilePictureUrl(chat, 'image')
  } catch {
    ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png'
  }

  return {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      id: "Undefined"
    },
    message: {
      locationMessage: {
        name: groupName,
        jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
      }
    }
  }
}

const handler = async (m, { conn, text, participants }) => {
  try {
    const meta = await conn.groupMetadata(m.chat)
    const groupName = meta.subject || ""
    const fechaRaw = new Date().toLocaleDateString("es-ES", { 
      timeZone: "America/Mexico_City", day: 'numeric', month: 'long' 
    })
    const fecha = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1)
    const texth = global.db.data.chats[m.chat].customTextH || groupName
    const users = participants.map((u) => conn.decodeJid(u.id))

    const watermark = groupName
      ? `\n\n> ${texth}┊ ${fecha}`
      : `\n\n> ${texth}`

    const fgrupo = await crearFgrupo(conn, m.chat)

    await conn.sendMessage(m.chat, { 
      text: (text || '') + watermark, 
      mentions: users 
    }, { quoted: fgrupo })

  } catch {
    const meta = await conn.groupMetadata(m.chat)
    const groupName = meta.subject || ""
    const fechaRaw = new Date().toLocaleDateString("es-ES", { 
      timeZone: "America/Mexico_City", day: 'numeric', month: 'long' 
    })
    const fecha = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1)
    const users = participants.map((u) => conn.decodeJid(u.id))
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)

    const watermark = groupName
      ? `\n\n> ${groupName}┊ ${fecha}`
      : `\n\n> ${fecha}`

    const fgrupo = await crearFgrupo(conn, m.chat)

    if (isMedia) {
      const mediax = await quoted.download?.()
      const options = { mentions: users, quoted: fgrupo }

      if (quoted.mtype === 'imageMessage') {
        conn.sendMessage(m.chat, { image: mediax, caption: (text || '') + watermark, ...options })
      } else if (quoted.mtype === 'videoMessage') {
        conn.sendMessage(m.chat, { video: mediax, caption: (text || '') + watermark, mimetype: 'video/mp4', ...options })
      } else if (quoted.mtype === 'audioMessage') {
        conn.sendMessage(m.chat, { audio: mediax, caption: watermark, mimetype: 'audio/mpeg', fileName: `Hidetag.mp3`, ...options })
      } else if (quoted.mtype === 'stickerMessage') {
        conn.sendMessage(m.chat, { sticker: mediax, ...options })
      }
    } else {
      const more = String.fromCharCode(8206)
      const masss = more.repeat(850) + watermark

      await conn.sendMessage(m.chat, { 
        text: `${masss}`, 
        mentions: users 
      }, { quoted: fgrupo })
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler
