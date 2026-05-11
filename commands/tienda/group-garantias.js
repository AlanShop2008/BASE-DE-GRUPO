let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sGarantias) {
            let garantias = chat.sGarantias;
            m.reply(garantias);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 garantias 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['garantias']
handler.tags = ['ventas']
handler.command = ['garantias']
handler.group = true
export default handler
