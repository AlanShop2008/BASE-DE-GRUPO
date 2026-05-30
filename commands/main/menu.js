import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  main: '𝗜𝗡𝗙𝗢 📚',
  search: '𝗕𝗨́𝗦𝗤𝗨𝗘𝗗𝗔 🔎',
  group: '𝗚𝗥𝗨𝗣𝗢𝗦 👥',
  freefire: '𝗙𝗥𝗘𝗘 𝗙𝗜𝗥𝗘 🎮',
  rpg: '𝗥𝗣𝗚 🌠',
  rg: '𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 📁',
  sticker: '𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 🏞',
  img: '𝗜𝗠𝗔́𝗚𝗘𝗡𝗘𝗦 📸',
  nable: '𝗢𝗡 / 𝗢𝗙𝗙 📴',
  downloader: '𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 📥',
  tools: '𝗛𝗘𝗥𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦 🔧',
  nsfw: '𝗡𝗦𝗙𝗪 🔞',
  anime: '𝗔𝗡𝗜𝗠𝗘 👑',
  ia: '𝗜𝗔 🤖'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {

    let userId = m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.sender

    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

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

    const fecha = new Date().toLocaleDateString('es-ES', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long'
    })

    let menuText = `
💜⋆.˚ 𓆩♡ 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 ♡𓆪 ˚.⋆💜

> 👋🏻 𝖻𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝗈 al sistema principal de *${botname}*
> ✨ aquí encontrarás todos los comandos premium del bot

╭⪩⪨─────────────⪩⪨╮
│ 💜 Usuario: *${name}*
│ 📅 Fecha: *${fecha}*
│ 🌸 Comandos: *${totalCommands}*
│ 👑 Creador: *ALAN SHOP*
│ ✨ Estado: *Online*
╰⪩⪨─────────────⪩⪨╯

\`\`\`
𝖲𝖾𝗅𝖾𝖼𝖼𝗂𝗈𝗇𝖺 una categoría
para explorar los comandos
\`\`\`
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

╭┈┈⊰ 👑 \`${tags[tag]}\` 👑
${comandos.map(menu =>
  `┊ 💜 ${_p}${menu.cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')}
╰┈┈┈┈┈┈┈┈┈⊰`
    }

    menuText += `

╭───────────────⊰ 💜
│ 🌸 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕
│ 👑 Sistema Premium
│ 🦋 IA • Descargas • Grupos
╰───────────────⊰ 💜
`

    await m.react('💜')

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

    await conn.sendFile(
      m.chat,
      pp,
      'catalogo.png',
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
