let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sPeliculas) {
            let Peliculas = chat.sPeliculas;
            m.reply(Peliculas);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['peliculas']
handler.tags = ['ventas']
handler.command = ['peliculas']
handler.group = true
export default handler
