let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sOrden) {
            let Orden = chat.sOrden;
            m.reply(Orden);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['orden']
handler.tags = ['ventas']
handler.command = ['orden']
handler.group = true
export default handler
