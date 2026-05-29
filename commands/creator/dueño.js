const handler = async (m, { conn }) => {
  const number = '525637362813' // 52 + tu número de 10 dígitos
  const name = 'Alan Shop'

  const jid = number + '@s.whatsapp.net'

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${name};;;;
FN:${name}
TEL;waid=${number}:${number}
END:VCARD`

  await m.react('👑')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{
        displayName: name,
        vcard: vcard
      }]
    }
  }, { quoted: m })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
