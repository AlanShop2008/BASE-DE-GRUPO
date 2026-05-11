let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sSeguidores) {
            let seguidores = chat.sSeguidores;
            m.reply(seguidores);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 seguidores 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['seguidores']
handler.tags = ['ventas']
handler.command = ['seguidores']
handler.group = true
export default handler
