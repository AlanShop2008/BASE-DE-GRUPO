let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sSeguro) {
            let Seguro = chat.sSeguro;
            m.reply(Seguro);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['seguro']
handler.tags = ['ventas']
handler.command = ['seguro']
handler.group = true
export default handler
