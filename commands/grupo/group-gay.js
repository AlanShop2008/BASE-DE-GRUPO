const handler = async (m, {conn}) => {
 let mentionedJid = await m.mentionedJid
  let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
  await conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/gay', {
    avatar: await conn.profilePictureUrl(user, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'error.png', '*🏳️‍🌈 𝙼𝙸𝚁𝙴𝙽 𝙰 𝙴𝚂𝚃𝙴 𝙶𝙰𝚈 🏳️‍🌈*', m);
};

handler.help = ['gay'];
handler.tags = ['fun'];
handler.command = /^(gay)$/i;
export default handler;
