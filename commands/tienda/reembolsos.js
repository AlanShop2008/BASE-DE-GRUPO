let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sReembolsos) {
            let Reembolsos = chat.sReembolsos;
            m.reply(Reembolsos);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['reembolsos']
handler.tags = ['ventas']
handler.command = ['reembolsos']
handler.group = true
export default handler