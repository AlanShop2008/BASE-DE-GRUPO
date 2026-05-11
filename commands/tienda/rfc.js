let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sRfc) {
            let Rfc = chat.sRfc;
            m.reply(Rfc);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['rfc']
handler.tags = ['ventas']
handler.command = ['rfc']
handler.group = true
export default handler
