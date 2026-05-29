import fs from 'fs'

const handler = async (m, { conn }) => {
  const number = '5215637362813'
  const name = 'Alan Shop'

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`

  await m.react('👑')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{
        displayName: name,
        vcard
      }]
    },
    contextInfo: {
      externalAdReply: {
        title: 'Alan Dev',
        body: 'Contacto oficial del bot',
        thumbnail: fs.readFileSync('./storage/img/catalogo.png'),
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
