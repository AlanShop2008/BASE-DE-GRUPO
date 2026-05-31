import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  main: 'INFORMACIÓN 📘',
  search: 'BÚSQUEDA 🔍',
  group: 'GRUPOS 🛡️',
  freefire: 'FREE FIRE 🔥',
  rpg: 'RPG ⚔️',
  rg: 'REGISTRO 📁',
  sticker: 'STICKERS 🗡️',
  img: 'IMÁGENES 🖼️',
  nable: 'ON / OFF 🔌',
  downloader: 'DESCARGAS 📥',
  tools: 'HERRAMIENTAS 🛠️',
  nsfw: 'NSFW 🔞',
  anime: 'ANIME 🏹',
  ia: 'IA 🤖',
  ventas: 'VENTAS 🛒'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : (p.help ? [p.help] : []),
        tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
        limit: p.limit,
        premium: p.premium
      }))

    let totalCommands = help.reduce((acc, p) => acc + p.help.filter(cmd => cmd && cmd.trim()).length, 0)

    const fecha = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Mexico_City', day: 'numeric', month: 'long' })

    let menuText = `
🔥⋆.˚ 𓂀 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𓂀 ˚.⋆🔥

> 👊🏻 Bienvenido al panel principal de *${botname}*
> ⚡ Aquí encontrarás todos los comandos premium

╭⪩⪨─────────────⪩⪨╮
│ 🔹 Usuario: *${name}*
│ 📅 Fecha: *${fecha}*
│ ⚔️ Comandos: *${totalCommands}*
│ 👑 Creador: *ALAN SHOP*
│ ✨ Estado: *Online*
╰⪩⪨─────────────⪩⪨╯

\`\`\`
Selecciona una categoría para explorar los comandos
\`\`\`
`.trim()

    for (let tag in tags) {
      let comandos = help.filter(p => p.tags.includes(tag)).flatMap(p =>
        p.help.filter(cmd => cmd && cmd.trim()).map(cmd => ({ cmd: cmd.trim(), limit: p.limit, premium: p.premium }))
      )

      if (!comandos.length) continue

      menuText += `

╭┈┈⊰ ⚔️ \`${tags[tag]}\` ⚔️
${comandos.map(c => `┊ 🔹 ${_p}${c.cmd}${c.limit ? ' 🟡' : ''}${c.premium ? ' 🔒' : ''}`).join('\n')}
╰┈┈┈┈┈┈┈┈┈⊰`
    }

    menuText += `

╭───────────────⊰ 🔥
│ ⚡ 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕
│ 👑 Sistema Premium
│ 🛡️ IA • Descargas • Grupos • Ventas
╰───────────────⊰ 🔥
`

    await m.react('🔥')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'
    let groupName = await conn.getName(m.chat)
    let ppUrl
    let thumbnail = null

    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
      const response = await fetch(ppUrl)
      thumbnail = Buffer.from(await response.arrayBuffer())
    } catch {
      if (fs.existsSync('./storage/img/catalogo.png')) thumbnail = fs.readFileSync('./storage/img/catalogo.png')
    }

    const fgrupo = {
      key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'AlanDevMenu' },
      message: { locationMessage: { name: groupName, jpegThumbnail: thumbnail } }
    }

    await conn.sendFile(m.chat, pp, 'catalogo.png', menuText, fgrupo)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler
