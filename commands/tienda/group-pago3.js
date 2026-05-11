let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sPago3) {
            let pago3 = chat.sPago3;
            m.reply(pago3);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙪𝙣 𝙢𝙚𝙩𝙤𝙙𝙤 𝙙𝙚 𝙥𝙖𝙜𝙤');
        }
}
handler.help = ['pago3']
handler.tags = ['ventas']
handler.command = ['pago3']
handler.group = true
export default handler
