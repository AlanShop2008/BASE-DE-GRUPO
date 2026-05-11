let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sSemanas) {
            let Semanas = chat.sSemanas;
            m.reply(Semanas);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['semanas']
handler.tags = ['ventas']
handler.command = ['semanas']
handler.group = true
export default handler
