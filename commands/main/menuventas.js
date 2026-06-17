import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

const comandosPath = path.join(process.cwd(), 'database', 'comandos_ventas.json')

let tags = {
  ventas: 'VENTAS 🛍️'
}

function readComandosVentas() {
  try {
    if (!fs.existsSync(comandosPath)) return {}
    return JSON.parse(fs.readFileSync(comandosPath))
  } catch {
    return {}
  }
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

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

    let dbComandos = readComandosVentas()
    let comandosGrupo = dbComandos[m.chat] || {}
    let listaComandos = Object.keys(comandosGrupo)

    let comandosCreados = ''

    if (listaComandos.length > 0) {
      comandosCreados += `📂 *COMANDOS CREADOS EN ESTE GRUPO*\n\n`

      listaComandos.forEach((cmd, index) => {
        comandosCreados += `${index + 1}. 🛒 *${_p}${cmd}*\n`
      })
    } else {
      comandosCreados = `📂 Este grupo aún no ha creado comandos con *${_p}set*`
    }

    let menuText = `
━━━━━━━━━━━━━━━━━━━━
${saludo}
━━━━━━━━━━━━━━━━━━━━

╭───────••───────╮
       *MENU DE VENTAS*
╰───────••───────╯

👤 *Usuario:* ${await conn.getName(userId)}
👑 *Premium:* ${user.premium ? 'Sí' : 'No'}
👥 *Usuarios:* ${totalUsers}
💎 *Premiums:* ${totalPremium}
⚡ *Modo:* ${modo}
⏱️ *Runtime:* ${uptime}

━━━━━━━━━━━━━━━━━━━━

📌 *Cómo crear tus propios comandos*

Con *${_p}set*

1️⃣ Escribe:
*${_p}setnombre* seguido del texto  
o responde a una imagen.

2️⃣ Para usarlo, escribe:
*${_p}nombre*

3️⃣ Cada grupo tiene su propia lista
de comandos creados.

✨ *Ejemplo práctico:*

• Creas:
*${_p}setpromo 2x1 en camisetas hasta el viernes*

• Usas:
*${_p}promo*

👉 El bot mostrará automáticamente tu promoción.

━━━━━━━━━━━━━━━━━━━━
`.trim()

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `

╭┈┈⊰ 🛒 *${tags[tag]}* 🛒
${comandos.map(menu =>
  menu.help.map(help =>
    `┊ 🔹 ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
  ).join('\n')
).join('\n')}
╰┈┈┈┈┈┈┈┈┈⊰
`
    }

    menuText += `

━━━━━━━━━━━━━━━━━━━━

${comandosCreados}

━━━━━━━━━━━━━━━━━━━━

╭───────────────⊰ 🔥
│ ⚡ *${botname}*
│ 👑 Sistema Premium
│ 🛡️ Ventas • Servicios • Bot
╰───────────────⊰ 🔥
`.trim()

    await m.react('🔥')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'
    let groupName = await conn.getName(m.chat)
    let ppUrl
    let thumb = null

    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
      let res = await fetch(ppUrl)
      thumb = Buffer.from(await res.arrayBuffer())
    } catch {
      thumb = null
    }

    const fgrupo = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        id: 'AlanDevVentas'
      },
      message: {
        locationMessage: {
          name: groupName,
          jpegThumbnail: thumb
        }
      }
    }

    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, fgrupo)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e.message || e}`, m)
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
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getSaludo() {
  let options = {
    timeZone: 'America/Mexico_City',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  let horaStr = new Date().toLocaleString('es-MX', options)
  let [hora] = horaStr.split(':').map(n => parseInt(n))

  if (hora >= 5 && hora < 12) return `🌅 Buenos días | 🕒 ${horaStr}`
  if (hora >= 12 && hora < 18) return `☀️ Buenas tardes | 🕒 ${horaStr}`
  return `🌙 Buenas noches | 🕒 ${horaStr}`
}
