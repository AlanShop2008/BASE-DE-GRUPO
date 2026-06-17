import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const botname = global.botname || 'Alan Dev'

const ROOT = path.join(process.cwd(), 'database', 'ventas_grupos')
const INDEX_FILE = path.join(ROOT, '_index.json')

if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT, { recursive: true })
if (!fs.existsSync(INDEX_FILE)) fs.writeFileSync(INDEX_FILE, JSON.stringify({}, null, 2))

if (!global.ventasReplyLock) global.ventasReplyLock = new Map()

function readJson(file, fallback = {}) {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file))
  } catch {
    return fallback
  }
}

function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function cleanName(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'Grupo'
}

function cleanCommandName(name = '') {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\wñ]/gi, '')
    .trim()
}

function getBody(m) {
  return (
    m.text ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  ).trim()
}

function getExtension(mimetype = '') {
  if (mimetype.includes('image')) return 'jpg'
  if (mimetype.includes('video')) return 'mp4'
  if (mimetype.includes('audio')) return 'mp3'
  if (mimetype.includes('pdf')) return 'pdf'
  if (mimetype.includes('word')) return 'docx'
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'xlsx'
  return 'bin'
}

function getMediaType(mimetype = '') {
  if (mimetype.includes('image')) return 'image'
  if (mimetype.includes('video')) return 'video'
  if (mimetype.includes('audio')) return 'audio'
  if (mimetype.includes('application')) return 'document'
  return 'text'
}

function isLocked(chat, sender, command) {
  const key = `${chat}:${sender}:${command}`
  const now = Date.now()
  const last = global.ventasReplyLock.get(key)

  if (last && now - last < 4000) return true

  global.ventasReplyLock.set(key, now)

  setTimeout(() => {
    if (global.ventasReplyLock.get(key) === now) {
      global.ventasReplyLock.delete(key)
    }
  }, 4500)

  return false
}

async function getGroupFolder(conn, chat) {
  let index = readJson(INDEX_FILE, {})
  let jidKey = chat.replace(/[^\w]/g, '_')

  if (index[chat]?.folder) {
    let folder = path.join(ROOT, index[chat].folder)

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
    if (!fs.existsSync(path.join(folder, 'media'))) fs.mkdirSync(path.join(folder, 'media'), { recursive: true })
    if (!fs.existsSync(path.join(folder, 'comandos.json'))) saveJson(path.join(folder, 'comandos.json'), {})

    return folder
  }

  let groupName = 'Grupo'

  try {
    groupName = await conn.getName(chat)
  } catch {
    groupName = 'Grupo'
  }

  let folderName = `${cleanName(groupName)}_${jidKey.slice(-8)}`
  let folder = path.join(ROOT, folderName)

  fs.mkdirSync(folder, { recursive: true })
  fs.mkdirSync(path.join(folder, 'media'), { recursive: true })

  if (!fs.existsSync(path.join(folder, 'comandos.json'))) {
    saveJson(path.join(folder, 'comandos.json'), {})
  }

  saveJson(path.join(folder, 'grupo.json'), {
    jid: chat,
    nombre: groupName,
    carpeta: folderName,
    creado: Date.now()
  })

  index[chat] = {
    jid: chat,
    nombre: groupName,
    folder: folderName
  }

  saveJson(INDEX_FILE, index)

  return folder
}

async function getCommandsFile(conn, chat) {
  let folder = await getGroupFolder(conn, chat)
  return path.join(folder, 'comandos.json')
}

async function saveCustomCommand(m, conn, command, text, usedPrefix) {
  if (!m.isGroup) {
    return conn.reply(m.chat, `> ⚠ Este comando solo funciona en grupos.`, m)
  }

  let cmd = String(command || '').toLowerCase()
  let name = ''
  let content = ''

  if (cmd.startsWith('set') && cmd.length > 3) {
    name = cleanCommandName(cmd.slice(3))
    content = (text || '').trim()
  } else {
    let args = (text || '').trim().split(/\s+/)
    name = cleanCommandName(args.shift() || '')
    content = args.join(' ').trim()
  }

  if (!name) {
    return conn.reply(
      m.chat,
      `> ⚠ Uso correcto:

*${usedPrefix}setstock Hay stock disponible*

O también:

*${usedPrefix}set stock Hay stock disponible*

También puedes responder a una imagen con:

*${usedPrefix}setstock*`,
      m
    )
  }

  let blocked = ['set', 'menuventas', 'menuv', 'menúv']
  if (blocked.includes(name)) {
    return conn.reply(m.chat, `> ⚠ Ese nombre no se puede usar para un comando.`, m)
  }

  let quoted = m.quoted || null
  let mediaPath = null
  let mimetype = ''
  let type = 'text'

  if (quoted) {
    mimetype = quoted.mimetype || quoted.msg?.mimetype || ''
    type = getMediaType(mimetype)

    if (type !== 'text' && typeof quoted.download === 'function') {
      let buffer = await quoted.download()

      if (buffer) {
        let folder = await getGroupFolder(conn, m.chat)
        let mediaDir = path.join(folder, 'media')
        let ext = getExtension(mimetype)
        let fileName = `${name}_${Date.now()}.${ext}`

        mediaPath = path.join(mediaDir, fileName)
        fs.writeFileSync(mediaPath, buffer)
      }
    }

    if (!content) {
      content = quoted.text || quoted.caption || ''
    }
  }

  if (!content && !mediaPath) {
    return conn.reply(
      m.chat,
      `> ⚠ Escribe el contenido del comando o responde a una imagen, video, audio o documento.`,
      m
    )
  }

  let folder = await getGroupFolder(conn, m.chat)
  let commandsFile = path.join(folder, 'comandos.json')
  let comandos = readJson(commandsFile, {})

  if (comandos[name]?.mediaPath && fs.existsSync(comandos[name].mediaPath)) {
    try {
      fs.unlinkSync(comandos[name].mediaPath)
    } catch {}
  }

  comandos[name] = {
    name,
    content,
    type,
    mimetype,
    mediaPath,
    createdBy: m.sender,
    createdAt: Date.now()
  }

  saveJson(commandsFile, comandos)

  let groupName = await conn.getName(m.chat).catch(() => 'este grupo')

  await conn.reply(
    m.chat,
    `> ✅ Comando guardado correctamente.

📂 *Grupo:* ${groupName}
📌 *Comando:* ${usedPrefix}${name}


async function sendCustomCommand(m, conn, cmd) {
  if (cmd.type === 'image' && cmd.mediaPath && fs.existsSync(cmd.mediaPath)) {
    await conn.sendMessage(
      m.chat,
      {
        image: fs.readFileSync(cmd.mediaPath),
        caption: cmd.content || ''
      },
      { quoted: m }
    )
    return
  }

  if (cmd.type === 'video' && cmd.mediaPath && fs.existsSync(cmd.mediaPath)) {
    await conn.sendMessage(
      m.chat,
      {
        video: fs.readFileSync(cmd.mediaPath),
        caption: cmd.content || ''
      },
      { quoted: m }
    )
    return
  }

  if (cmd.type === 'audio' && cmd.mediaPath && fs.existsSync(cmd.mediaPath)) {
    await conn.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(cmd.mediaPath),
        mimetype: cmd.mimetype || 'audio/mpeg'
      },
      { quoted: m }
    )
    return
  }

  if (cmd.type === 'document' && cmd.mediaPath && fs.existsSync(cmd.mediaPath)) {
    await conn.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(cmd.mediaPath),
        mimetype: cmd.mimetype || 'application/octet-stream',
        fileName: `${cmd.name}`
      },
      { quoted: m }
    )
    return
  }

  await conn.reply(m.chat, cmd.content || '> ⚠ Comando sin contenido.', m)
}

async function sendMenuVentas(m, conn, usedPrefix) {
  if (!m.isGroup) {
    return conn.reply(m.chat, `> ⚠ Este menú funciona en grupos.`, m)
  }

  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId] || { exp: 0, premium: false }

  let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
  let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

  let uptime = clockString(process.uptime() * 1000)
  let modo = global.opts?.self ? 'PRIVADO' : 'PÚBLICO'
  let saludo = getSaludo()

  let groupName = await conn.getName(m.chat).catch(() => 'Grupo')
  let commandsFile = await getCommandsFile(conn, m.chat)
  let comandos = readJson(commandsFile, {})

  let lista = Object.values(comandos)
    .sort((a, b) => a.createdAt - b.createdAt)

  let comandosCreados = ''

  if (lista.length > 0) {
    comandosCreados += `📂 *COMANDOS CREADOS EN ESTE GRUPO*\n\n`

    lista.forEach((cmd, index) => {
      let emoji = cmd.type === 'image' ? '🖼️'
        : cmd.type === 'video' ? '🎬'
        : cmd.type === 'audio' ? '🎧'
        : cmd.type === 'document' ? '📄'
        : '🛒'

      comandosCreados += `${index + 1}. ${emoji} *${usedPrefix}${cmd.name}*\n`
    })
  } else {
    comandosCreados = `📂 Este grupo aún no ha creado comandos con *${usedPrefix}set*`
  }

  let menuText = `
━━━━━━━━━━━━━━━━━━━━
${saludo}
━━━━━━━━━━━━━━━━━━━━

╭───────••───────╮
       *MENU DE VENTAS*
╰───────••───────╯

👥 *Grupo:* ${groupName}
👤 *Usuario:* ${await conn.getName(userId)}
👑 *Premium:* ${user.premium ? 'Sí' : 'No'}
👥 *Usuarios:* ${totalUsers}
💎 *Premiums:* ${totalPremium}
⚡ *Modo:* ${modo}
⏱️ *Runtime:* ${uptime}

━━━━━━━━━━━━━━━━━━━━

📌 *Cómo crear tus propios comandos*

Con *${usedPrefix}set*

1️⃣ Escribe:
*${usedPrefix}setnombre* seguido del texto

Ejemplo:
*${usedPrefix}setstock Hay actas disponibles*

2️⃣ También puedes usarlo así:
*${usedPrefix}set stock Hay actas disponibles*

3️⃣ Para usarlo, escribe:
*${usedPrefix}stock*

4️⃣ Cada grupo tiene su propia carpeta
y su propia lista de comandos.

✨ *Ejemplo práctico:*

• Creas:
*${usedPrefix}setpromo 2x1 hasta el viernes*

• Usas:
*${usedPrefix}promo*

👉 El bot mostrará automáticamente tu promoción.

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
  let thumb = null

  try {
    let ppUrl = await conn.profilePictureUrl(m.chat, 'image')
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

  try {
    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, fgrupo)
  } catch {
    await conn.reply(m.chat, menuText, m)
  }
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    usedPrefix = usedPrefix || '.'
    command = String(command || '').toLowerCase()

    if (command.startsWith('set')) {
      return await saveCustomCommand(m, conn, command, text, usedPrefix)
    }

    if (['menuventas', 'menuv', 'menúv'].includes(command)) {
      return await sendMenuVentas(m, conn, usedPrefix)
    }

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `✖️ Error:\n\n${e.message || e}`, m)
  }
}

handler.before = async (m, { conn, usedPrefix }) => {
  try {
    if (!m.isGroup) return false

    let body = getBody(m)
    usedPrefix = usedPrefix || '.'

    if (!body.startsWith(usedPrefix)) return false

    let commandName = body
      .slice(usedPrefix.length)
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()

    if (!commandName) return false

    if (
      commandName.startsWith('set') ||
      ['menuventas', 'menuv', 'menúv'].includes(commandName)
    ) return false

    if (isLocked(m.chat, m.sender, commandName)) {
      return true
    }

    let commandsFile = await getCommandsFile(conn, m.chat)
    let comandos = readJson(commandsFile, {})
    let cmd = comandos[commandName]

    if (!cmd) return false

    await sendCustomCommand(m, conn, cmd)
    return true

  } catch (e) {
    console.error(e)
    return false
  }
}

handler.help = ['menuventas', 'setnombre <texto>']
handler.tags = ['ventas']
handler.command = /^(set|menuventas|menuv|menúv)/i

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
