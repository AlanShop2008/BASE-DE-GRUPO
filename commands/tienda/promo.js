let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sPromo) {
            let Promo = chat.sPromo;
            m.reply(Promo);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['promo']
handler.tags = ['ventas']
handler.command = ['promo']
handler.group = true
export default handler
