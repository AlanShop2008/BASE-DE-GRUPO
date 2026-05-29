export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true
  if (m.isGroup) return false
  if (!m.message) return true

  const bot = global.db.data.settings[this.user.jid] || {}

  if (bot.antiPrivate && !isOwner && !isROwner) {

    const number = '5215637362813'
    const name = 'Alan Dev'

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
END:VCARD`

    await conn.reply(
      m.chat,
      `🚫 *El privado del bot está restringido.*

📌 Si deseas adquirir el bot, soporte, actualizaciones o algún servicio, comunícate directamente con el desarrollador.

⏳ Serás bloqueado automáticamente en unos segundos.`,
      m
    )

    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: name,
        contacts: [{
          displayName: name,
          vcard
        }]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

    await conn.updateBlockStatus(m.sender, 'block')

    return true
  }

  return false
}
