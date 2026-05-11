let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sVigencia) {
            let vigencia = chat.sVigencia;
            m.reply(vigencia);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['vigencia']
handler.tags = ['ventas']
handler.command = ['vigencia']
handler.group = true
export default handler
