import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

let tags = {
  ventas: 'VENTAS 🛍️'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender

    if (!global.db.data.users) global.db.data.users = {}
    let user = global.db.data.users[userId] || { exp: 0, premium: false }

    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium
      }))

    let saludo = getSaludo()
    let uptime = clockString(process.uptime() * 1000)
    let modo = global.opts?.self ? 'PRIVADO' : 'PÚBLICO'

    let menuText = `
🔥⋆.˚ 𓂀 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕 𓂀 ˚.⋆🔥

> 👊🏻 Bienvenido al panel de ventas de *${botname}*
> 🛍️ Aquí encontrarás todos los comandos premium

╭⪩⪨─────────────⪩⪨╮
│ 👤 Usuario: *${await conn.getName(userId)}*
│ 👑 Premium: *${user.premium ? 'Sí' : 'No'}*
│ 👥 Usuarios: *${totalUsers}*
│ 💎 Premiums: *${totalPremium}*
│ ⚡ Modo: *${modo}*
│ ⏱️ Runtime: *${uptime}*
│ 🕒 ${saludo}
╰⪩⪨─────────────⪩⪨╯

\`\`\`
Selecciona un comando de ventas para explorar
\`\`\`
`.trim()

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `

╭┈┈⊰ 🛒 \`${tags[tag]}\` 🛒
${comandos.map(menu =>
  menu.help.map(help =>
    `┊ 🔹 ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
  ).join('\n')
).join('\n')}
╰┈┈┈┈┈┈┈┈┈⊰
`
    }

    menuText += `

╭───────────────⊰ 🔥
│ ⚡ 𝐀𝐋𝐀𝐍 𝐃𝐄𝐕
│ 👑 Sistema Premium
│ 🛡️ Ventas • Servicios • Bot
╰───────────────⊰ 🔥
`

    await m.react('🔥')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'
    let groupName = await conn.getName(m.chat)
    let ppUrl

    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png'
    }

    const fgrupo = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        id: "AlanDevVentas"
      },
      message: {
        locationMessage: {
          name: groupName,
          jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
        }
      }
    }

    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, fgrupo)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
  }
}

handler.help = ['menuventas']
handler.tags = ['main']
handler.command = ['menuventas', 'menuv', 'menúv']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getSaludo() {
  let options = { timeZone: "America/Mexico_City", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }
  let horaStr = new Date().toLocaleString("es-MX", options)
  let [hora] = horaStr.split(":").map(n => parseInt(n))
  if (hora >= 5 && hora < 12) return `🌅 Buenos días | ${horaStr}`
  if (hora >= 12 && hora < 18) return `☀️ Buenas tardes | ${horaStr}`
  return `🌙 Buenas noches | ${horaStr}`
}
