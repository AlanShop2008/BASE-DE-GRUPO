let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sJuegos) {
            let juegos = chat.sJuegos;
            m.reply(juegos);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙟𝙪𝙚𝙜𝙤𝙨 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['juegos']
handler.tags = ['ventas']
handler.command = ['juegos']
handler.group = true
export default handler
