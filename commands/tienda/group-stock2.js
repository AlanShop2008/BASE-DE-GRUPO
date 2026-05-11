let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sStock2) {
            let stock2 = chat.sStock2;
            m.reply(stock2);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙣𝙖𝙙𝙖 𝙚𝙣 𝙚𝙡 𝙞𝙣𝙫𝙚𝙣𝙩𝙖𝙧𝙞𝙤 2');
        }
}
handler.help = ['stock2']
handler.tags = ['ventas']
handler.command = ['stock2']
handler.group = true
export default handler
