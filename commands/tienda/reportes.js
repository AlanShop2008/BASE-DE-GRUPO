let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sReportes) {
            let Reportes = chat.sReportes;
            m.reply(Reportes);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['reportes']
handler.tags = ['ventas']
handler.command = ['reportes']
handler.group = true
export default handler
