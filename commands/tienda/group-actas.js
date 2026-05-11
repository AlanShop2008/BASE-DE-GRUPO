let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sActas) {
            let actas = chat.sActas;
            m.reply(actas);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 actas 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['actas']
handler.tags = ['ventas']
handler.command = ['actas']
handler.group = true
export default handler
