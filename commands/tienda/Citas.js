let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sCitas) {
            let Citas = chat.sCitas;
            m.reply(Citas);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['citas']
handler.tags = ['ventas']
handler.command = ['citas']
handler.group = true
export default handler
