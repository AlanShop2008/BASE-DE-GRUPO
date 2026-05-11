let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sActas = text
conn.reply(m.chat, `Actas 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤`, m)  

} else throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙡𝙤 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚`
}

handler.help = ['setactas + Texto']
handler.tags = ['ventas']
handler.command = ['setactas'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
