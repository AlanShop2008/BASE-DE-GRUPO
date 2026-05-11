let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sLibros) {
            let libros = chat.sLibros;
            m.reply(libros);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 𝙡𝙞𝙗𝙧𝙤𝙨 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['libros']
handler.tags = ['ventas']
handler.command = ['libros']
handler.group = true
export default handler
