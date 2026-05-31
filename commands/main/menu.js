import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  downloader: '📥 DESCARGAS',
  ia: '🤖 IA',
  freefire: '🎮 FREE FIRE',
  group: '🛡️ GRUPOS',
  tools: '🛠️ HERRAMIENTAS',
  sticker: '🗡️ STICKERS',
  search: '🔍 BÚSQUEDA',
  anime: '🏹 ANIME',
  ventas: '🛒 VENTAS'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {

    let userId = m.mentionedJid?.[0] || m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let user = global.db.data.users[userId] || {
      premium: false
    }

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help)
          ? plugin.help
          : (plugin.help ? [plugin.help] : []),

        tags: Array.isArray(plugin.tags)
          ? plugin.tags
          : (plugin.tags ? [plugin.tags] : []),

        limit: plugin.limit,
        premium: plugin.premium
      }))

    let totalCommands = help.reduce((acc, plugin) => {
      return acc + plugin.help.filter(cmd => cmd && cmd.trim()).length
    }, 0)

    let runtime = clockString(process.uptime() * 1000)

    let menuText = `
🔥⋆.˚ 𓂀 ALAN DEV 𓂀 ˚.⋆🔥

╭──────────────╮
│ 👤 Usuario: ${name}
│ ⚔️ Comandos: ${totalCommands}
│ 💎 Premium: ${user.premium ? 'Sí' : 'No'}
│ ⏱️ Runtime: ${runtime}
│ 🌐 Estado: Online
╰──────────────╯
`.trim()

    for (let tag in tags) {

      let comandos = help
        .filter(menu => menu.tags.includes(tag))
        .flatMap(menu =>
          menu.help.map(cmd => ({
            cmd,
            limit: menu.limit,
            premium: menu.premium
          }))
        )

      if (!comandos.length) continue

      menuText += `

╭┈┈⊰ ${tags[tag]}
${comandos.map(menu =>
  `┊ 🔹 ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
╰┈┈┈┈┈┈┈┈⊰`
    }

    menuText += `

⚡ ALAN DEV PREMIUM
🛒 Ventas • IA • Grupos
`

    await m.react('🔥')

    let pp = global.db.data.chats[m.chat].customPhotoM
      || './storage/img/catalogo.png'

    let groupName = await conn.getName(m.chat)

    let thumbnail = null

    try {

      let ppUrl = await conn.profilePictureUrl(m.chat, 'image')

      const response = await fetch(ppUrl)

      thumbnail = Buffer.from(await response.arrayBuffer())

    } catch {

      if (fs.existsSync('./storage/img/catalogo.png')) {
        thumbnail = fs.readFileSync('./storage/img/catalogo.png')
      }

    }

    const fgrupo = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        id: 'AlanDevMenu'
      },
      message: {
        locationMessage: {
          name: groupName,
          jpegThumbnail: thumbnail
        }
      }
    }

    await conn.sendFile(
      m.chat,
      pp,
      'menu.jpg',
      menuText,
      fgrupo
    )

  } catch (e) {

    console.error(e)

    conn.reply(
      m.chat,
      `✖️ Error al mostrar el menú.\n\n${e}`,
      m
    )
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler

function clockString(ms) {

  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, 0))
    .join(':')
}
