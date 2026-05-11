let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sCertificados) {
            let Certificados = chat.sCertificados;
            m.reply(Certificados);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['Certificados']
handler.tags = ['ventas']
handler.command = ['certificados']
handler.group = true
export default handler
