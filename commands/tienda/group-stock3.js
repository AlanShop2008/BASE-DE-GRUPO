let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sStock3) {
            let stock3 = chat.sStock3;
            m.reply(stock3);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙣𝙖𝙙𝙖 𝙚𝙣 𝙚𝙡 𝙞𝙣𝙫𝙚𝙣𝙩𝙖𝙧𝙞𝙤 3');
        }
}
handler.help = ['stock3']
handler.tags = ['ventas']
handler.command = ['stock3']
handler.group = true
export default handler
