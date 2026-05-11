let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sSeguidores = text
conn.reply(m.chat, `𝙨𝙚𝙜𝙪𝙞𝙙𝙤𝙧𝙚𝙨 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤`, m)  

} else throw `𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙡𝙤 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚`
}

handler.help = ['setseguidores + Texto']
handler.tags = ['ventas']
handler.command = ['setseguidores'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
