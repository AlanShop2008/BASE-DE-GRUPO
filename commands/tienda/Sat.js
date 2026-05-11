let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sSat) {
            let Sat = chat.sSat;
            m.reply(Sat);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['sat']
handler.tags = ['ventas']
handler.command = ['sat']
handler.group = true
export default handler
