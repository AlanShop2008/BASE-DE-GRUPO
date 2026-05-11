let handler = async (m, { conn, text, isROwner, isOwner }) => {
    if (text) {
        global.db.data.chats[m.chat].setcombos3 = text; // Guardamos el set editable
        conn.reply(m.chat, 'Combos3 𝙝𝙖 𝙨𝙞𝙙𝙤 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤.', m);
    } else {
        throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙇os Combos 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤, 𝙚𝙟𝙚𝙢𝙥𝙡𝙤: \n.setcombos3 𝙇𝙤𝙨 𝙢𝙚𝙟𝙤𝙧𝙚𝙨 combos.`
    }
};

handler.help = ['setcombos3']
handler.tags = ['ventas']
handler.command = ['setcombos3']
handler.group = true
export default handler
