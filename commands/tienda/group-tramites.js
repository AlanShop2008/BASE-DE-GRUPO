let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sTramites) {
            let tramites = chat.sTramites;
            m.reply(tramites);
        } else {
            m.reply('❄️𝐓𝐫𝐚𝐦𝐢𝐭𝐞𝐬 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['tramites']
handler.tags = ['ventas']
handler.command = ['tramites']
handler.group = true
export default handler
