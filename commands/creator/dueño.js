import fs from 'fs'

const handler = async (m, { conn }) => {
  const number = '5215637362813'
  const name = 'Alan Shop'

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`

  const encabezado = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      id: "AlanDev"
    },
    message: {
      contactMessage: {
        displayName: "Alan Dev",
        vcard: `BEGIN:VCARD
VERSION:3.0
FN:Alan Dev
ORG:Tienda Oficial
END:VCARD`,
        jpegThumbnail: fs.readFileSync('./storage/img/catalogo.png')
      }
    }
  }

  await m.react('🌸')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{
        displayName: name,
        vcard
      }]
    }
  }, { quoted: encabezado })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
