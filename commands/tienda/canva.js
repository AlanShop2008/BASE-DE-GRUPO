let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sCanva) {
            let Canva = chat.sCanva;
            m.reply(Canva);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['canva']
handler.tags = ['ventas']
handler.command = ['canva']
handler.group = true
export default handler
