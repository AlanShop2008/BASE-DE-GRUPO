let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sStock3 = text
conn.reply(m.chat, `𝙎𝙩𝙤𝙘𝙠3 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤 🫧`, m)  

} else throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙩𝙪 𝙎𝙩𝙤𝙘𝙠3 🫧`
}

handler.help = ['setstock3 + Texto']
handler.tags = ['ventas']
handler.command = ['setstock3'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
