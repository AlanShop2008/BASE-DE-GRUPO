import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  main: 'NÚCLEO',
  group: 'CONTROL',
  freefire: 'COMPETITIVO',
  rpg: 'AVENTURA',
  rg: 'REGISTRO',
  sticker: 'STICKERS',
  img: 'IMÁGENES',
  nable: 'AJUSTES',
  downloader: 'DESCARGAS',
  tools: 'TOOLS',
  search: 'BÚSQUEDA',
  anime: 'ANIME',
  nsfw: 'EXTRA'
}

let icons = {
  main: '◇',
  group: '▣',
  freefire: '⌖',
  rpg: '✦',
  rg: '□',
  sticker: '✧',
  img: '▧',
  nable: '◈',
  downloader: '⇩',
  tools: '⚙',
  search: '⌕',
  anime: '✺',
  nsfw: '◆'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium
      }))

    let totalCommands = help.reduce((acc, plugin) => {
      return acc + plugin.help.filter(cmd => cmd && cmd.trim()).length
    }, 0)

    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    const fecha = new Date().toLocaleDateString('es-ES', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long'
    })

    let uptime = clockString(process.uptime() * 1000)
    let emojiM = global.db.data.chats[m.chat].customEmojiM || '▸'

    let menuText = `
╔═════ 𖤐 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𖤐 ═════╗
║ 𝖡𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽@, *${name}*
║ 𝖲𝗂𝗌𝗍𝖾𝗆𝖺 𝖽𝖾 𝖼𝗈𝗆𝖺𝗇𝖽𝗈𝗌 𝗉𝗋𝖾𝗆𝗂𝗎𝗆
╚══════════════════════╝

╭─〔 𝐏𝐀𝐍𝐄𝐋 𝐃𝐄𝐋 𝐁𝐎𝐓 〕─╮
│ 👑 Creador: *ALAN SHOP*
│ 📅 Fecha: *${fecha}*
│ ⏱️ Activo: *${uptime}*
│ ⚡ Comandos: *${totalCommands}*
│ 👥 Usuarios: *${totalUsers}*
│ 💎 Premium: *${totalPremium}*
╰────────────────────╯

╭─〔 𝐌𝐎𝐃𝐎 𝐃𝐄 𝐔𝐒𝐎 〕─╮
│ Usa el prefijo *${_p}* antes del comando.
│ Ejemplo: *${_p}menu*
╰────────────────────╯
`

    for (let tag in tags) {
      let comandos = help
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

      if (!comandos.length) continue

      menuText += `

┏━━━〔 ${icons[tag] || '◇'} ${tags[tag]} 〕━━━┓
${comandos.map((menu, i) =>
  `┃ ${String(i + 1).padStart(2, '0')} ${emojiM} ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
┗━━━━━━━━━━━━━━━━━━━━┛`
    }

    menuText += `

╭─〔 𝐅𝐈𝐍 𝐃𝐄𝐋 𝐌𝐄𝐍𝐔 〕─╮
│ 𖤐 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 | 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𖤐
╰────────────────────╯
`

    await m.react('⚡')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'

    let groupName = await conn.getName(m.chat)
    let ppUrl
    let thumbnail = null

    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
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

    await conn.sendFile(m.chat, pp, 'catalogo.png', menuText, fgrupo)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
  }
}

handler.help = ['Menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
