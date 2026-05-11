import initPersonalizacion from '../../commands/main/_personalizacion.js'

let handler = async (m, { conn, text, isRowner }) => {

if (!text) return m.reply(`🪐 Por favor, proporciona un nombre para el bot.\n> Ejemplo: #setname RockoBot/🌥️ Rocko Pro 🪐`);

const names = text.split('/');
if (names.length !== 2) return m.reply(`🪐 Formato incorrecto.\n> Ej: #setname NombreBot/Textobot`);

let botData = global.db.data.chats[m.chat] || {};

const nombreLargo = names[0].trim();
const textoDecorativo = names[1].trim();

let nombreCorto = nombreLargo
    .replace(/(bot|ai|pro|plus|premium|the|team|official)\b/gi, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();

if (!nombreCorto) nombreCorto = nombreLargo;

if (nombreCorto.includes(' ')) {
let palabras = nombreCorto.split(' ').filter(p => p.length > 2);
    nombreCorto = palabras[0] || nombreLargo;
  }

if (nombreCorto.length > 10) {
    nombreCorto = nombreCorto.slice(0, 8);
  }

nombreCorto = nombreCorto.charAt(0).toUpperCase() + nombreCorto.slice(1);

botData.Botname = nombreLargo;
botData.TextBot = textoDecorativo;
botData.shortname = nombreCorto;

global.db.data.chats[m.chat] = botData;

global.chatId = m.chat
await initPersonalizacion()

conn.reply(m.chat, `✅ Nombre largo actualizado:\n> *${botData.Botname}*\n\n✅ Nombre corto generado:\n> *${botData.shortname}*\n\n✨ Texto decorativo actualizado:\n> *${botData.TextBot}*`, m, fake);
}

handler.help = ['setname']
handler.tags = ['sockets']
handler.command = ['setname']
handler.rowner = true

export default handler
