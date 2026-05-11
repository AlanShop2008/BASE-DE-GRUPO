let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sPago3 = text
conn.reply(m.chat, `𝙈𝙚𝙩𝙤𝙙𝙤 𝙙𝙚 𝙋𝙖𝙜𝙤 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤 🫧`, m)  

} else throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙩𝙪 𝙢𝙚𝙩𝙤𝙙𝙤 𝙙𝙚 𝙥𝙖𝙜𝙤 🫧`
}

handler.help = ['setpago3 + Texto']
handler.tags = ['ventas']
handler.command = ['setpago3'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
