const handler = async (m, { conn }) => {
  const number = '5215637362813'
  const name = 'Alan Shop'

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`

  await m.react('🫶')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{
        displayName: name,
        vcard
      }]
    }
  }, { quoted: m })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
