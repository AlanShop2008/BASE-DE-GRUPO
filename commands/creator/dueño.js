const handler = async (m, { conn }) => {
  const number = '5637362813'
  const name = 'Alan Shop'
  const botname = global.botname || 'Bot WhatsApp'

  const texto = `
╭──「 👑 𝐃𝐔𝐄𝐍̃𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓 」
┃
┃ 👤 𝐍𝐨𝐦𝐛𝐫𝐞: *${name}*
┃ 📱 𝐍𝐮́𝐦𝐞𝐫𝐨: wa.me/${number}
┃ 🤖 𝐁𝐨𝐭: *${botname}*
┃
╰━━━━━━━━━━━━⬣
`.trim()

  await m.react('👑')
  await conn.reply(m.chat, texto, m)
}

handler.help = ['dueño']
handler.tags = ['main']
handler.command = /^(dueño|dueno|owner|creador)$/i

export default handler
