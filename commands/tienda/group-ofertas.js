let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sOfertas) {
            let ofertas = chat.sOfertas;
            m.reply(ofertas);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 ofertas 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['ofertas']
handler.tags = ['group']
handler.command = ['ofertas']
handler.group = true
export default handler
