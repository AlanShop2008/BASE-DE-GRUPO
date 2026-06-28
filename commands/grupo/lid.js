case 'lid': {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0] ||
    m.sender

  let lid =
    m.quoted?.key?.participant ||
    m.quoted?.key?.participantAlt ||
    user

  let texto = `╭─「 🆔 INFO MIEMBRO 」
│ 👤 JID: ${user}
│ 🔐 LID: ${lid}
╰────────────`

  await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
}
break