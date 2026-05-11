let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];

    // Verificamos si se ha configurado el texto para Max
    if (chat.setcombos3) {
        let combos3 = chat.setcombos3;
        await conn.reply(m.chat, combos3, m);
    } else {
        m.reply('No hay combos disponibles, 𝙪𝙩𝙞𝙡𝙞𝙯𝙖 .setcombos3 𝙥𝙖𝙧𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙪𝙣o.');
    }
};

handler.help = ['combos3']
handler.tags = ['ventas']
handler.command = ['combos3']
handler.group = true
export default handler
