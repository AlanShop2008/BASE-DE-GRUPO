const handler = async (m, { conn }) => {
  const number = '525637362813' // 52 + número de 10 dígitos
  const name = 'Alan Shop'

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`

  await m.react('👑')

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [{ vcard }]
    }
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    text: `👑 *Contacto del dueño:*\n\n📱 https://wa.me/${number}\n\nToca el enlace para abrir el chat directo.`
  }, { quoted: m })
}

handler.help = ['dueño']
handler.tags = ['creator']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
