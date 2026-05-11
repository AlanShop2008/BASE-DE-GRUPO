
var handler = async (m, { conn, args }) => {
    try {
        let group = m.chat;
        let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);
        conn.reply(m.chat, '🔗 ' + link, m, { detectLink: true });
    } catch (error) {
        conn.reply(m.chat, 'Error al obtener el enlace del grupo. Asegúrate de que soy administrador y estoy en un grupo.', m);
    }
}

handler.help = ['link'];
handler.tags = ['group'];
handler.command = ['link', 'linkgroup'];

handler.group = true;
handler.botAdmin = true;

export default handler;
