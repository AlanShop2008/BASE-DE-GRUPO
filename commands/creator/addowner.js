// By WillZek
// Mejorado para ROKO-BOT

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const ejemplo = `*✧ Uso incorrecto del comando.*

*🜸 Ejemplos válidos:*
*🜸 ${usedPrefix + command} @${m.sender.split('@')[0]}*
*🜸 ${usedPrefix + command} ${m.sender.split('@')[0]}*
*🜸 ${usedPrefix + command} respondiendo un mensaje*`;

  let who = false;

  if (m.mentionedJid && m.mentionedJid[0]) {
    who = m.mentionedJid[0];
  } else if (m.quoted && m.quoted.sender) {
    who = m.quoted.sender;
  } else if (text) {
    const numero = text.replace(/[^0-9]/g, '');
    if (numero.length < 8) return conn.reply(m.chat, ejemplo, m);
    who = numero + '@s.whatsapp.net';
  }

  if (!who) return conn.reply(m.chat, ejemplo, m, { mentions: [m.sender] });

  if (!global.owner) global.owner = [];
  if (!Array.isArray(global.owner)) global.owner = [];

  const numeroLimpio = who.replace(/[^0-9]/g, '');
  const jid = numeroLimpio + '@s.whatsapp.net';

  switch (command.toLowerCase()) {
    case 'addowner': {
      const yaExiste = global.owner.some(owner => {
        const ownerNum = Array.isArray(owner) ? owner[0] : owner;
        return String(ownerNum).replace(/[^0-9]/g, '') === numeroLimpio;
      });

      if (yaExiste) {
        return conn.reply(m.chat, '*⚠️ Ese número ya está en la lista de owners.*', m);
      }

      global.owner.push([jid, 'Owner agregado', true]);

      await conn.reply(
        m.chat,
        `*✅ Listo, ahora es owner del bot:*\n@${numeroLimpio}`,
        m,
        { mentions: [jid] }
      );
      break;
    }

    case 'delowner': {
      const index = global.owner.findIndex(owner => {
        const ownerNum = Array.isArray(owner) ? owner[0] : owner;
        return String(ownerNum).replace(/[^0-9]/g, '') === numeroLimpio;
      });

      if (index === -1) {
        return conn.reply(m.chat, '*⚠️ Ese número no está en la lista de owners.*', m);
      }

      global.owner.splice(index, 1);

      await conn.reply(
        m.chat,
        `*✅ Eliminado de owners del bot:*\n@${numeroLimpio}`,
        m,
        { mentions: [jid] }
      );
      break;
    }
  }
};

handler.command = /^(addowner|delowner)$/i;
handler.rowner = true;

export default handler;
