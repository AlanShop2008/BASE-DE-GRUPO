let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sSpotify) {
            let Spotify = chat.sSpotify;
            m.reply(Spotify);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['sp']
handler.tags = ['ventas']
handler.command = ['sp']
handler.group = true
export default handler
