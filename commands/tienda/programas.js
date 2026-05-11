let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sProgramas) {
            let Programas = chat.sProgramas;
            m.reply(Programas);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['programas']
handler.tags = ['ventas']
handler.command = ['programas']
handler.group = true
export default handler
