let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sAdo) {
            let Ado = chat.sAdo;
            m.reply(Ado);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['ado']
handler.tags = ['ventas']
handler.command = ['ado']
handler.group = true
export default handler
