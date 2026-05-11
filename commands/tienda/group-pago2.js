let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sPago2) {
            let pago2 = chat.sPago2;
            m.reply(pago2);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙪𝙣 𝙢𝙚𝙩𝙤𝙙𝙤 𝙙𝙚 𝙥𝙖𝙜𝙤');
        }
}
handler.help = ['pago2']
handler.tags = ['ventas']
handler.command = ['pago2']
handler.group = true
export default handler
