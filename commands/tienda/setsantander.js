let handler = async (m, { conn, text, isROwner, isOwner }) => {
    if (text) {
        global.db.data.chats[m.chat].setsantander = text; // Guardamos el set editable
        conn.reply(m.chat, '𝙇𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝙎𝙖𝙣𝙩𝙖𝙣𝙙𝙚𝙧 𝙝𝙖 𝙨𝙞𝙙𝙤 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙a.', m);
    } else {
        throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙇𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝙎𝙖𝙣𝙩𝙖𝙣𝙙𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤, 𝙚𝙟𝙚𝙢𝙥𝙡𝙤: \n.Santander (𝙩𝙪 𝙢𝙚𝙩𝙤𝙙𝙤 𝙙𝙚 𝙥𝙖𝙜𝙤)`;
    }
};

handler.help = ['setsantander + Texto']
handler.tags = ['ventas']
handler.command = ['setsantander'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
