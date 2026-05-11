let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sYoutube) {
            let Youtube = chat.sYoutube;
            m.reply(Youtube);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['youtube']
handler.tags = ['ventas']
handler.command = ['youtube']
handler.group = true
export default handler
