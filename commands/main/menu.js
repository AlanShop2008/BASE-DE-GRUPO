const botname = global.botname || 'Alan Dev'

const tags = {
  main: '🏠 MENÚ PRINCIPAL',
  downloader: '📥 DESCARGAS',
  ia: '🤖 INTELIGENCIA ARTIFICIAL',
  freefire: '🎮 FREE FIRE',
  group: '🛡️ GRUPOS',
  tools: '🛠️ HERRAMIENTAS',
  sticker: '🗡️ STICKERS',
  search: '🔍 BÚSQUEDA',
  anime: '🏹 ANIME',
  ventas: '🛒 VENTAS',
  owner: '👑 OWNER'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const prefix = _p || '.'
    const userId = m.mentionedJid?.[0] || m.sender
    const name = await conn.getName(userId).catch(() => 'Usuario')

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = {
        premium: false
      }
    }

    const user = global.db.data.users[userId]

    const plugins = Object.values(global.plugins || {})
      .filter(plugin => plugin && !plugin.disabled)

    const help = plugins.map(plugin => ({
      help: Array.isArray(plugin.help)
        ? plugin.help
        : plugin.help
          ? [plugin.help]
          : [],

      tags: Array.isArray(plugin.tags)
        ? plugin.tags
        : plugin.tags
          ? [plugin.tags]
          : [],

      limit: plugin.limit,
      premium: plugin.premium
    }))

    const totalCommands = help.reduce((acc, plugin) => {
      return acc + plugin.help.filter(cmd => cmd && cmd.trim()).length
    }, 0)

    const runtime = clockString(process.uptime() * 1000)

    const fecha = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City'
    })

    const hora = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour: '2-digit',
      minute: '2-digit'
    })

    let menuText = `
╭━━━━━━〔 🔥 ${botname.toUpperCase()} 🔥 〕━━━━━━⬣
┃
┃ 👤 Usuario: ${name}
┃ 💎 Premium: ${user.premium ? 'Activado ✅' : 'No activo ❌'}
┃ ⚔️ Comandos: ${totalCommands}
┃ ⏱️ Runtime: ${runtime}
┃ 📅 Fecha: ${fecha}
┃ 🕒 Hora: ${hora}
┃ 🌐 Estado: Online ✅
┃
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━━━━〔 📌 LEYENDA 〕━━━━━━⬣
┃ 🔹 Comando disponible
┃ 🟡 Usa límite
┃ 🔒 Solo premium
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`.trim()

    for (const tag in tags) {
      const vistos = new Set()

      const comandos = help
        .filter(menu => menu.tags.includes(tag))
        .flatMap(menu =>
          menu.help
            .filter(cmd => cmd && cmd.trim())
            .map(cmd => ({
              cmd: cmd.trim(),
              limit: menu.limit,
              premium: menu.premium
            }))
        )
        .filter(menu => {
          const key = `${tag}-${menu.cmd}`
          if (vistos.has(key)) return false
          vistos.add(key)
          return true
        })
        .sort((a, b) => a.cmd.localeCompare(b.cmd))

      if (!comandos.length) continue

      menuText += `

╭━━━━〔 ${tags[tag]} 〕━━━━⬣
${comandos.map(menu => {
  const limit = menu.limit ? ' 🟡' : ''
  const premium = menu.premium ? ' 🔒' : ''
  return `┃ 🔹 ${prefix}${menu.cmd}${limit}${premium}`
}).join('\n')}
╰━━━━〔 ${comandos.length} comandos 〕━━━━⬣`
    }

    menuText += `

╭━━━━━━〔 ⚡ ALAN DEV PREMIUM 〕━━━━━━⬣
┃ 🛒 Ventas automáticas
┃ 🤖 IA y herramientas
┃ 🛡️ Administración de grupos
┃ 📥 Descargas rápidas
┃
┃ Escribe ${prefix}menu para ver este menú.
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`

    await m.react('🔥').catch(() => {})

    console.log('✅ Menú generado:', menuText.length, 'caracteres')
    console.log('📤 Enviando menú...')

    await conn.sendMessage(
      m.chat,
      {
        text: menuText
      },
      {
        quoted: m
      }
    )

    console.log('✅ Menú enviado correctamente')

  } catch (e) {
    console.error('❌ Error en menú:', e)

    await conn.reply(
      m.chat,
      `✖️ Error al mostrar el menú.\n\n${e.message || e}`,
      m
    ).catch(() => {})
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler

function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}
