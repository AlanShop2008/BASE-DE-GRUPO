import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Ingresa un enlace de Dropbox.', m);
    }

    if (!/dropbox\.com/i.test(text)) {
        return conn.reply(m.chat, '❌ El enlace no parece ser de Dropbox.', m);
    }

    try {
        let downloadUrl = text
            .replace('dl=0', 'dl=1')
            .replace('?dl=0', '?dl=1');

        if (!downloadUrl.includes('dl=1')) {
            downloadUrl += (downloadUrl.includes('?') ? '&dl=1' : '?dl=1');
        }

        await conn.sendMessage(m.chat, {
            react: { text: '📥', key: m.key }
        });

        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            caption: '✅ Video descargado desde Dropbox.'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '❌ No pude descargar ese video. Verifica que el enlace sea público.', m);
    }
};

handler.help = ['dropbox <link>'];
handler.tags = ['downloader'];
handler.command = /^(dropbox|dbx)$/i;

export default handler;