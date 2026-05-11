let partidasVS = {}

let handler = async (m, { conn, args, command }) => {
  if (args.length < 2) {
    return conn.reply(m.chat, '_Debes indicar la hora (HH:MM) y la modalidad._', m)
  }

  const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  if (!horaRegex.test(args[0])) {
    return conn.reply(m.chat, '_Hora inválida. Usa HH:MM en formato 24h._', m)
  }

  let vs = parseInt(command)
  let maxJugadores = vs
  let maxSuplentes = Math.floor(vs / 2)

  let [hora, minuto] = args[0].split(':').map(Number)
  let horaCol = `${((hora + 1) % 24).toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`
  let modalidad = args.slice(1).join(' ')

  let plantilla = `
${vs} 𝐕𝐄𝐑𝐒𝐔𝐒 ${vs}

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗 : ${args[0]}
🇨🇴 𝐂𝐎𝐋 : ${horaCol}

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
${Array.from({ length: maxJugadores }).map((_, i) =>
  `${i === 0 ? '👑' : '🥷🏻'} ┇ `
).join('\n')}

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
${Array.from({ length: maxSuplentes }).map(() => `🥷🏻 ┇`).join('\n')}

❤️ → Unirse como jugador
💛 → Unirse como suplente
❌ → Salir de la lista
`.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })

  partidasVS[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    maxJugadores,
    maxSuplentes,
    horaMex: args[0],
    horaCol,
    modalidad,
    originalMsg: msg
  }
}

handler.before = async function (m) {
  if (!m.message?.reactionMessage) return false

  let { key, text } = m.message.reactionMessage
  if (!partidasVS[key.id]) return false

  let data = partidasVS[key.id]
  let sender = m.participant || m.key.participant || m.key.remoteJid

  if (['❤️', '❤', '👍', '👍🏻'].includes(text)) {
    if (!data.jugadores.includes(sender) && !data.suplentes.includes(sender)) {
      if (data.jugadores.length < data.maxJugadores) {
        data.jugadores.push(sender)
      } else if (data.suplentes.length < data.maxSuplentes) {
        data.suplentes.push(sender)
      }
    }
  }

  if (['💛', '💛🏻'].includes(text)) {
    if (!data.jugadores.includes(sender) && !data.suplentes.includes(sender)) {
      if (data.suplentes.length < data.maxSuplentes) {
        data.suplentes.push(sender)
      }
    }
  }

  if (['❌', '✖️'].includes(text)) {
    data.jugadores = data.jugadores.filter(j => j !== sender)
    data.suplentes = data.suplentes.filter(s => s !== sender)
  }

  let jugadoresTxt = Array.from({ length: data.maxJugadores }).map((_, i) =>
    `${i === 0 ? '👑' : '🥷🏻'} ┇ ${data.jugadores[i] ? '@' + data.jugadores[i].split('@')[0] : ''}`
  ).join('\n')

  let suplentesTxt = Array.from({ length: data.maxSuplentes }).map((_, i) =>
    `🥷🏻 ┇ ${data.suplentes[i] ? '@' + data.suplentes[i].split('@')[0] : ''}`
  ).join('\n')

  let plantilla = `
${data.maxJugadores} 𝐕𝐄𝐑𝐒𝐔𝐒 ${data.maxJugadores}

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗 : ${data.horaMex}
🇨🇴 𝐂𝐎𝐋 : ${data.horaCol}

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${data.modalidad}

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
${jugadoresTxt}

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
${suplentesTxt}

${data.jugadores.length < data.maxJugadores || data.suplentes.length < data.maxSuplentes
  ? '❤️ → Unirse | 💛 → Suplente | ❌ → Salir'
  : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
`.trim()

  await this.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes]
  })

  return false
}

handler.help = ['4vs4','6vs6', '8vs8', '12vs12', '16vs16', '24vs24']
handler.tags = ['freefire']
handler.command = /^(4|6|8|12|16|24)vs\1$/i
handler.group = true
handler.admin = true

export default handler
