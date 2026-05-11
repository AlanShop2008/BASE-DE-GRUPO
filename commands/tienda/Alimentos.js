let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sAlimentos) {
            let Alimentos = chat.sAlimentos;
            m.reply(Alimentos);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['Alimentos']
handler.tags = ['ventas']
handler.command = ['alimentos']
handler.group = true
export default handler
