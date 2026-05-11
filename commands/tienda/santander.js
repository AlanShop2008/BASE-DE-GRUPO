let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];

    // Verificamos si se ha configurado el texto para Max
    if (chat.setsantander) {
        let santander = chat.setsantander;
        await conn.reply(m.chat, santander, m);
    } else {
        m.reply('𝙉𝙤 𝙨𝙚 𝙝𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙞𝙙𝙤 𝙪𝙣a 𝙐𝙣𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝙥𝙖𝙧𝙖 𝙎𝙖𝙣𝙩𝙖𝙣𝙙𝙚𝙧, 𝙪𝙩𝙞𝙡𝙞𝙯𝙖 .setsantander 𝙥𝙖𝙧𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙪𝙣a.');
    }
};

handler.help = ['santander']
handler.tags = ['ventas']
handler.command = ['santander']
handler.group = true
export default handler
