let gruposCache = {}

async function getGroups(conn) {
  let groups = []

  try {
    groups = await conn.groupFetchAllParticipating()
    groups = Object.entries(groups).map(([jid, data]) => ({
      jid,
      name: data.subject || 'Sin nombre'
    }))
  } catch (e) {
    groups = Object.entries(conn.chats || {})
      .filter(([jid]) => jid.endsWith('@g.us'))
      .map(([jid, chat]) => ({
        jid,
        name: chat.subject || chat.name || 'Sin nombre'
      }))
  }

  groups = groups.filter(g => g.name !== 'Sin nombre')

  return groups
}

const handler = async (m, { conn, command, text, isOwner, isROwner }) => {
  if (!isOwner && !isROwner) {
    return conn.reply(m.chat, '🚫 Solo el dueño del bot puede usar este comando.', m)
  }

  if (command === 'grupos') {
    let groups = await getGroups(conn)

    if (!groups.length) {
      return conn.reply(m.chat, '⚠️ El bot no está en ningún grupo.', m)
    }

    gruposCache[m.sender] = groups

    let texto = `💜 *GRUPOS DONDE ESTÁ EL BOT*\n\n`
    texto += `📌 Total: *${groups.length}*\n\n`

    texto += groups.map((g, i) => {
      return `*${i + 1}.* ${g.name}\n🆔 ${g.jid}`
    }).join('\n\n')

    texto += `\n\nPara salir de un grupo usa:\n*.exit número*\n\nEjemplo:\n*.exit 1*`

    return conn.reply(m.chat, texto, m)
  }

  if (command === 'exit') {
    let num = parseInt(text)

    if (!num || isNaN(num)) {
      return conn.reply(m.chat, '⚠️ Usa el número del grupo.\n\nEjemplo: *.exit 1*', m)
    }

    let groups = gruposCache[m.sender] || await getGroups(conn)
    let grupo = groups[num - 1]

    if (!grupo) {
      return conn.reply(m.chat, '❌ Ese número no existe en la lista.', m)
    }

    await conn.reply(m.chat, `🚪 Saliendo del grupo:\n\n*${grupo.name}*`, m)

    await conn.groupLeave(grupo.jid)

    if (conn.chats?.[grupo.jid]) delete conn.chats[grupo.jid]
    if (conn.store?.chats?.delete) conn.store.chats.delete(grupo.jid)
    if (conn.ev?.emit) conn.ev.emit('chats.delete', [grupo.jid])

    gruposCache[m.sender] = groups.filter(g => g.jid !== grupo.jid)

    return conn.reply(m.chat, `✅ El bot salió correctamente de:\n\n*${grupo.name}*`, m)
  }
}

handler.help = ['grupos', 'exit']
handler.tags = ['creator']
handler.command = /^(grupos|exit)$/i
handler.owner = true

export default handler
