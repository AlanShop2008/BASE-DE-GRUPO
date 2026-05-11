import { areJidsSameUser } from '@whiskeysockets/baileys';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const emoji = '👻', emoji2 = '📜', emoji3 = '⚰️', advertencia = '⚠️';

const handler = async (m, { conn, participants, command, text }) => {
  const groupMetadata = await conn.groupMetadata(m.chat);
  const botNumber = conn.user.jid;
  const participantes = participants.map(p => p.id);

  const cantidad = text && !isNaN(text) ? parseInt(text) : participantes.length;
  const fantasmas = [];

  for (let i = 0; i < cantidad; i++) {
    const id = participantes[i];
    const user = global.db.data.users?.[id];
    const miembro = participants.find(p => areJidsSameUser(p.id, id));

    const esAdmin = miembro?.admin === 'admin' || miembro?.admin === 'superadmin';

    if (!esAdmin && (!user || user.chat === 0) && !user?.whitelist) {
      fantasmas.push(id);
    }
  }

  if (command === 'fantasmas') {
    if (!fantasmas.length) {
      return conn.reply(m.chat, `${emoji} *¡No se han detectado fantasmas!*`, m);
    }

    const texto = `┄ ┄ 〔 _*FANTASMAS DETECTADOS*_ 👻 〕 ┄ ─
┃ ${emoji2} *LISTA DE FANTASMAS:*\n${fantasmas.map(u => '┃ ⊳ @' + u.split('@')[0]).join('\n')}
┃
┃ ${advertencia} *Nota:* Esta lista se basa en la actividad registrada desde que el bot está en el grupo.
┄ ┄ ┄ ─┄ ┄ ┄ ─┄ ┄ ┄ ─`;

    return conn.reply(m.chat, texto, m, { mentions: fantasmas });
  }

  if (command === 'kickfantasmas') {
    if (!fantasmas.length) {
      return conn.reply(m.chat, `${emoji} *No hay fantasmas que eliminar*, el grupo está activo.`, m);
    }

    const texto = `┄ ┄ ┄ 〔 *_ELIMINACION_* ${emoji3} 〕┄  ┄ ─
┃ Se detectaron *${fantasmas.length} fantasmas*
┃ Iniciando purga en *5 segundos...*
┃
┃ ${emoji2} *Lista de expulsión:*\n${fantasmas.map(u => '┃ ⊳ @' + u.split('@')[0]).join('\n')}
┄ ┄ ┄ ─┄ ┄ ┄ ─┄ ┄ ┄ ─┄ ┄ ┄ ─`;

    await conn.reply(m.chat, texto, m, { mentions: fantasmas });
    await delay(5000);

    let errores = 0;
    for (const id of fantasmas) {
      try {
        const miembro = participants.find(p => areJidsSameUser(p.id, id));
        const esAdmin = miembro?.admin === 'admin' || miembro?.admin === 'superadmin';

        if (!esAdmin && id !== botNumber) {
          await conn.groupParticipantsUpdate(m.chat, [id], 'remove');
          await delay(3000); // Espera para evitar límites de WhatsApp
        }
      } catch (e) {
        console.error(`❌ Error al eliminar ${id}:`, e.message);
        errores++;
      }
    }

    conn.reply(m.chat, `${emoji3} *Proceso terminado.* ${fantasmas.length - errores} eliminados, ${errores} fallos.`, m);
  }
};

handler.command = ['fantasmas', 'kickfantasmas'];
handler.tags = ['group'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
