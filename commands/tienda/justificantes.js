let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sJustificantes) {
            let Justificantes = chat.sJustificantes;
            m.reply(Justificantes);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['justificantes']
handler.tags = ['ventas']
handler.command = ['justificantes']
handler.group = true
export default handler
