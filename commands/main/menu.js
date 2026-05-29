import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  main: 'INFO 📚',
  search: 'BUSQUEDA 🔎',
  group: 'GRUPOS 👥',
  freefire: 'FREE FIRE 📌',
  rpg: 'RPG 🌠',
  rg: 'REGISTRO 📁',
  sticker: 'STICKERS 🏞',
  img: 'IMAGENES 📸',
  nable: 'ON / OFF 📴',
  downloader: 'DESCARGAS 📥',
  tools: 'HERRAMIENTAS 🔧',
  nsfw: 'NSFW 🔞',
  anime: 'ANIME 👑'
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

    const fecha = new Date().toLocaleDateString('es-ES', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long'
    })

    let menuText = `
🌸⃟ 𓆩 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𓆪 ⃟🌸

꒰ঌ 𝖧𝗈𝗅𝖺, *${name}* ໒꒱
╭───────────────╮
│ ୨୧ 𝖬𝖾𝗇𝗎́ 𝗉𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅
│ ୨୧ 𝖥𝖾𝖼𝗁𝖺: *${fecha}*
│ ୨୧ 𝖢𝗈𝗆𝖺𝗇𝖽𝗈𝗌: *${totalCommands}*
│ ୨୧ 𝖢𝗋𝖾𝖺𝖽𝗈𝗋: *ALAN SHOP*
╰───────────────╯

♡ 𝖲𝖾𝗅𝖾𝖼𝖼𝗂𝗈𝗇𝖺 𝗎𝗇𝖺 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂́𝖺 ♡
`.trim()

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

┌ ୨୧ ${tags[tag]}
│
${comandos.map(menu =>
  `│ 𖹭 ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
│
└─────────────── ୨୧`
    }

    menuText += `

𖹭 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𖹭
𝖡𝗈𝗍 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝗉𝖺𝗋𝖺 𝗀𝗋𝗎𝗉𝗈𝗌, 𝗏𝖾𝗇𝗍𝖺𝗌 𝗒 𝗌𝖾𝗋𝗏𝗂𝖼𝗂𝗈𝗌.
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
