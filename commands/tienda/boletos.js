let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sBoletos) {
            let Boletos = chat.sBoletos;
            m.reply(Boletos);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['boletos']
handler.tags = ['ventas']
handler.command = ['boletos']
handler.group = true
export default handler
