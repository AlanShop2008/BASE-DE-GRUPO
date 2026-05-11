let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];

    // Verificamos si se ha configurado el texto para Max
    if (chat.setbaz) {
        let baz = chat.setbaz;
        await conn.reply(m.chat, baz, m);
    } else {
        m.reply('𝙉𝙤 𝙨𝙚 𝙝𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙞𝙙𝙤 𝙇𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝘽𝙖𝙣𝙘𝙤 𝘼𝙯𝙩𝙚𝙘𝙖, 𝙪𝙩𝙞𝙡𝙞𝙯𝙖 .setbaz 𝙥𝙖𝙧𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙪𝙣a.');
    }
};

handler.help = ['baz']
handler.tags = ['ventas']
handler.command = ['baz']
handler.group = true
export default handler
