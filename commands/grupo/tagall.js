// Tagall Mejorado por willzek y Antonyxx_
import fetch from 'node-fetch';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { participants, args }) => {
  const pesan = args.join` `;
  const oi = `*» INFO :* ${pesan}`;

  let groupName = ""; try { const meta = await conn.groupMetadata(m.chat); groupName = meta.subject || ""; } catch (e) { groupName = ""; }
  
  let mensajes = `*!  ${groupName.toUpperCase()} !*\n  *PARA ${participants.length} MIEMBROS* 🗣️\n\n ${oi}\n`;

  for (const mem of participants) {
    let numero = PhoneNumber('+' + mem.jid.replace('@s.whatsapp.net', '')).getNumber('international');
    let api = `https://api.delirius.store/tools/country?text=${numero}`;
    let response = await fetch(api);
    let json = await response.json();
    let emoji = global.db.data.chats[m.chat].customEmoji;
    let paisdata = emoji ? emoji : json.result.emoji;
    mensajes += `${paisdata} @${mem.id.split('@')[0]}\n`;
  }

    mensajes += `╰⸼ ┄ ┄ ꒰ ׅ୭ *${groupName}* ୧ ׅ꒱─ ┄ ⸼`;

  conn.sendMessage(m.chat, { text: mensajes, mentions: participants.map((a) => a.id) });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;
