let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
        if (chat.sAntecedentes) {
            let Antecedentes = chat.sAntecedentes;
            m.reply(Antecedentes);
        } else {
            m.reply('❄️𝐈𝐧𝐯𝐞𝐧𝐭𝐚𝐫𝐢𝐨 𝐯𝐚𝐜𝐢𝐨');
        }
}
handler.help = ['antecedentes']
handler.tags = ['ventas']
handler.command = ['antecedentes']
handler.group = true
export default handler
