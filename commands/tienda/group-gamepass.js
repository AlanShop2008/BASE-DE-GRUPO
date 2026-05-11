let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sGamepass) {
            let gamepass = chat.sGamepass;
            m.reply(gamepass);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 Gamepass 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['gamepass']
handler.tags = ['ventas']
handler.command = ['gamepass']
handler.group = true
export default handler
