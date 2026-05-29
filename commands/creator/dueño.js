const handler = async (m, { conn }) => {
  const number = '5637362813'
  const name = 'Alan Shop'

  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${name}
TEL;type=CELL;type=VOICE;waid=52${number}:+52 ${number}
END:VCARD
`.trim()

  await m.react('👑')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }]
    }
  }, { quoted: m })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
