let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sRecargas) {
            let Recargas = chat.sRecargas;
            m.reply(Recargas);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['recargas']
handler.tags = ['ventas']
handler.command = ['recargas']
handler.group = true
export default handler
