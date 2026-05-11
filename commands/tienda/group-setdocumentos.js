let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].sDocumentos = text
conn.reply(m.chat, `𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐀𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨 🫶🏻`, m)  

} else {
m.reply('𝙀𝙨𝙘𝙧𝙞𝙗𝙚 𝙡𝙤 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚 🧐')
}}

handler.help = ['setdocumentos + Texto']
handler.tags = ['ventas']
handler.command = ['setdocumentos'] 
handler.botAdmin = true
handler.admin = true
handler.group = true

export default handler
