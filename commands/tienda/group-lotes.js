let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sLotes) {
            let lotes = chat.sLotes;
            m.reply(lotes);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 lotes 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['lotes']
handler.tags = ['group']
handler.command = ['lotes']
handler.group = true
export default handler
