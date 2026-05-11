let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sDocumentos) {
            let documentos = chat.sDocumentos;
            m.reply(documentos);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 Documentos 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['documentos']
handler.tags = ['ventas']
handler.command = ['documentos']
handler.group = true
export default handler
