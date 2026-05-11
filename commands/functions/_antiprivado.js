export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`> "𝙐𝙨𝙪𝙖𝙧𝙞𝙤 🌟 @${m.sender.split`@`[0]}", 𝙀𝙨𝙩𝙖́ 𝙥𝙧𝙤𝙝𝙞𝙗𝙞𝙙𝙤 𝙚𝙨𝙘𝙧𝙞𝙗𝙞𝙧 𝙖𝙡 𝙥𝙧𝙞𝙫𝙖𝙙𝙤 ⚠️ 𝙔 𝙨𝙚𝙧𝙖́𝙨 𝙗𝙡𝙤𝙦𝙪𝙚𝙖𝙙@ 𝙖𝙪𝙩𝙤𝙢𝙖́𝙩𝙞𝙘𝙖𝙢𝙚𝙣𝙩𝙚\n\n\n\n\n𝙨𝙞 𝙣𝙚𝙘𝙚𝙨𝙞𝙩𝙖𝙨 𝙖𝙡𝙜𝙪𝙣𝙤 𝙙𝙚 𝙢𝙞𝙨 𝙨𝙚𝙧𝙫𝙞𝙘𝙞𝙤𝙨 𝙘𝙤𝙢𝙪𝙣𝙞𝙘𝙖𝙩𝙚 𝙘𝙤𝙣 𝙢𝙞 𝙘𝙧𝙚𝙖𝙙𝙤𝙧. 𝙍𝙚𝙘𝙪𝙚𝙧𝙙𝙖 𝙨𝙚𝙜𝙪𝙞𝙧 𝙚𝙡 𝙘𝙖𝙣𝙖𝙡 𝙥𝙖𝙧𝙖 𝙢𝙖𝙨 𝙞𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞𝙤𝙣, 𝙨𝙩𝙞𝙘𝙠𝙚𝙧𝙨, 𝙞𝙢𝙖𝙜𝙚𝙣𝙚𝙨 𝙤 𝙢𝙖𝙨 𝙘𝙤𝙨𝙞𝙩𝙖𝙨 :3 https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a `, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
