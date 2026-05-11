let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sAdicionales) {
            let adicionales = chat.sAdicionales;
            m.reply(adicionales);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 adicionales 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['adicionales']
handler.tags = ['ventas']
handler.command = ['adicionales']
handler.group = true
export default handler
