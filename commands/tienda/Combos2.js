let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];

    // Verificamos si se ha configurado el texto para Max
    if (chat.setcombos2) {
        let combos2 = chat.setcombos2;
        await conn.reply(m.chat, combos2, m);
    } else {
        m.reply('No hay combos disponibles, 𝙪𝙩𝙞𝙡𝙞𝙯𝙖 .setcombos2 𝙥𝙖𝙧𝙖 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙪𝙣o.');
    }
};

handler.help = ['combos2']
handler.tags = ['ventas']
handler.command = ['combos2']
handler.group = true
export default handler
