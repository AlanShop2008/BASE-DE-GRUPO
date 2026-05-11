let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sInstalacion) {
            let instalacion = chat.sInstalacion;
            m.reply(instalacion);
        } else {
            m.reply('❄️𝙉𝙤 𝙝𝙖𝙮 𝙪𝙣a instalacion');
        }
}
handler.help = ['instalacion']
handler.tags = ['ventas']
handler.command = ['instalacion']
handler.group = true
export default handler
