let handler = async (m, { conn, text, isROwner, isOwner }) => {
    if (text) {
        global.db.data.chats[m.chat].setbaz = text; // Guardamos el set editable
        conn.reply(m.chat, '𝙇𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝘽𝙖𝙣𝙘𝙤 𝘼𝙯𝙩𝙚𝙘𝙖 𝙝𝙖 𝙨𝙞𝙙𝙤 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤.', m);
    } else {
        throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙇𝙖 𝙘𝙪𝙚𝙣𝙩𝙖 𝘽𝙖𝙣𝙘𝙤 𝘼𝙯𝙩𝙚𝙘𝙖 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙚𝙧 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤, 𝙚𝙟𝙚𝙢𝙥𝙡𝙤: \n.setBaz 𝙇𝙤𝙨 𝙢𝙚𝙟𝙤𝙧𝙚𝙨 𝙡𝙤𝙠𝙤𝙣𝙤𝙨.`;
    }
};

handler.help = ['setbaz + Texto']
handler.tags = ['ventas']
handler.command = ['setbaz'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
