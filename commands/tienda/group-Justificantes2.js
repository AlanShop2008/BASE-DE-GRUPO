let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sJustificantes2) {
            let justificantes2 = chat.sJustificantes2;
            m.reply(justificantes2);
        } else {
            m.reply('𝙉𝙤 𝙝𝙖𝙮 justificantes2 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨');
        }
}
handler.help = ['justificantes2']
handler.tags = ['ventas']
handler.command = ['justificantes2']
handler.group = true
export default handler
