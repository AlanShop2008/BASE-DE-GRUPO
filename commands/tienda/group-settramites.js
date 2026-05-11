let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sTramites = text
conn.reply(m.chat, `𝙏𝙧𝙖𝙢𝙞𝙩𝙚𝙨 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤 🫧`, m)  

} else throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙩𝙪 𝙏𝙧𝙖𝙢𝙞𝙩𝙚𝙨 🫧`
}

handler.help = ['settramites + Texto']
handler.tags = ['ventas']
handler.command = ['settramites'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
