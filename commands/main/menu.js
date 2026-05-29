import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  'main': 'PRINCIPAL 👑',
  'group': 'GRUPOS 👥',
  'freefire': 'FREE FIRE 🎮',
  'sticker': 'STICKERS 🏞',
  'downloader': 'DESCARGAS 📥',
  'tools': 'HERRAMIENTAS 🔧',
  'search': 'BÚSQUEDA 🔎',
  'rpg': 'RPG 🌠',
  'rg': 'REGISTRO 📁',
  'img': 'IMÁGENES 📸',
  'nable': 'ON / OFF 📴',
  'anime': 'ANIME 👑',
  'nsfw': 'NSFW 🔞'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium,
      }))

    let totalCommands = help.reduce((acc, plugin) => acc + plugin.help.length, 0)

    const fecha = new Date().toLocaleDateString('es-ES', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long'
    })

    let emojiM = global.db.data.chats[m.chat].customEmojiM || '👑'

    let menuText = `
» 👋🏻 𝖻𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝗈 𝖺𝗅 𝗆𝖾𝗇𝗎 𝗉𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅 𝖽𝖾 *† ${botname}*  
𝖺𝗊𝗎𝗂́ 𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝖺𝗋𝖺́𝗌 𝗅𝗈𝗌 𝖼𝗈𝗆𝖺𝗇𝖽𝗈𝗌 𝗉𝖺𝗋𝖺 𝗆𝖺𝗇𝗍𝖾𝗇𝖾𝗋 𝗎𝗇 𝗍𝗈𝗍𝖺𝗅 𝗈𝗋𝖽𝖾𝗇 𝖾𝗇 𝗍𝗎𝗌 𝗀𝗋𝗎𝗉𝗈𝗌.

*╭┈┈⊰* 👑 \`INFO DEL BOT\` 👑
*┊* 👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: *${name}*
*┊* 📅 𝗙𝗲𝗰𝗵𝗮: *${fecha}*
*┊* ⚡ 𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀: *${totalCommands}*
*┊* 🔥 𝗘𝘀𝘁𝗮𝗱𝗼: *Online*
*┊* 👑 𝗖𝗿𝗲𝗮𝗱𝗼𝗿: *ALAN SHOP*
*╰┈┈┈┈┈┈┈┈┈⊰*

\`\`\`Selecciona una categoría y usa los comandos según tus necesidades.\`\`\`
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `
─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
*╭┈┈⊰* ${emojiM} \`${tags[tag]}\` ${emojiM}
${comandos.map(menu =>
  menu.help.map(help =>
    `*┊* ${emojiM} *${_p}${help}*${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
  ).join('\n')
).join('\n')}
*╰┈┈┈┈┈┈┈┈┈⊰*
`
    }

    menuText += `
\`\`\`✨ ${botname} | Sistema premium para grupos y ventas.✨\`\`\`
`

    await m.react('⚡️')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'

    let groupName = await conn.getName(m.chat)
    let ppUrl
    let thumbnail = null

    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
      thumbnail = Buffer.from(await (await fetch(ppUrl)).arrayBuffer())
    } catch {
      thumbnail = fs.existsSync('./storage/img/catalogo.png')
        ? fs.readFileSync('./storage/img/catalogo.png')
        : null
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
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['Menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler
