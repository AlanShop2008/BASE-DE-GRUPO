let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sPermisos) {
            let Permisos = chat.sPermisos;
            m.reply(Permisos);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['permisos']
handler.tags = ['ventas']
handler.command = ['permisos']
handler.group = true
export default handler
