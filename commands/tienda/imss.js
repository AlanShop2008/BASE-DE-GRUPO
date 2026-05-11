let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sImss) {
            let Imss = chat.sImss;
            m.reply(Imss);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['imss']
handler.tags = ['ventas']
handler.command = ['imss']
handler.group = true
export default handler
