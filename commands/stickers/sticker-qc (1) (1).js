import { sticker } from '../../lib/sticker.js';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
let text;

if (args.length >= 1) {
text = args.join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else {
return conn.reply(m.chat, '🚩 Te Faltó El Texto!', m);
}

if (!text) return conn.reply(m.chat, '🚩 Te Faltó El Texto!', m);

const who = m.mentionedJid && m.mentionedJid[0] 
? m.mentionedJid[0] 
: m.fromMe 
? conn.user.jid 
: m.sender;

const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
const mishi = text.replace(mentionRegex, '');

if (mishi.length > 40) {
return conn.reply(m.chat, '🚩 El texto no puede tener mas de 40 caracteres', m);
}

const pp = await conn.profilePictureUrl(who).catch(() => 
'https://telegra.ph/file/24fa902ead26340f3df2c.png'
);

const nombre = await conn.getName(who);

const apiUrl = `https://sylphy.xyz/tools/qc?avatar=${encodeURIComponent(pp)}&text=${encodeURIComponent(mishi)}&name=${encodeURIComponent(nombre)}&type=v2&api_key=WillZek_dev`;

try {

const { data } = await axios.get(apiUrl, {
responseType: 'arraybuffer'
});

let stiker = await sticker(data, false, global.botname, global.author);

if (stiker) {
return conn.sendFile(m.chat, stiker, 'qc.webp', '', m);
}

} catch (err) {
console.error(err);
conn.reply(m.chat, 'Error', m);
}
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc)$/i;

export default handler;
