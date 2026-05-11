let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sCodigo) {
            let Codigo = chat.sCodigo;
            m.reply(Codigo);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['codigo']
handler.tags = ['ventas']
handler.command = ['codigo']
handler.group = true
export default handler
