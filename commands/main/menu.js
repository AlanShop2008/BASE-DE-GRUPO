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
  anime: 'ANIME 👑',
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender

    let name = 'Usuario'
    try {
      name = conn.getName(userId) || 'Usuario'
    } catch {
      name = 'Usuario'
    }

    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let user = global.db.data.users[userId] || {
      exp: 0,
      premium: false
    }

    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let help = Object.values(global.plugins || {})
      .filter(plugin => plugin && !plugin.disabled)
      .map(plugin => ({
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
        premium: plugin.premium,
      }))

    let totalCommands = help.reduce((acc, plugin) => {
      return acc + limpiarComandos(plugin.help).length
    }, 0)

    const fecha = new Date().toLocaleDateString('es-ES', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long'
    })

    let emojiM = global.db.data.chats[m.chat].customEmojiM || '🩵'

    let menuText = `_*¡𝐇𝐨𝐥𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝@ ${name} 𝐄𝐬𝐩𝐞𝐫𝐨 𝐲 𝐭𝐞𝐧𝐠𝐚𝐬 𝐮𝐧 𝐠𝐫𝐚𝐧 𝐝𝐢𝐚 ☀️!*_

┌────── •• ──────┐
    「 _*𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓*_ 」
└────── •• ──────┘
┃ 💙 _𝖬𝐨𝐝𝐨_ : 𝐏𝐑𝐈𝐕𝐀𝐃𝐎
┃ 💙 _𝐅𝐞𝐜𝐡𝐚_ : ${fecha}
┃ 💙 _𝖢𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐞𝐧 𝐭𝐨𝐭𝐚𝐥_ : ${totalCommands}
┃ 💙 _𝖢𝖱𝖤𝖠𝖣𝖮𝖱_ : *𝐀𝐋𝐀𝐍 𝐒𝐇𝐎𝐏*
━━━━━━━━━━━━━━━

_*L I S T A - D E - C O M A N D O S*_
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      let listaComandos = comandos
        .map(menu => {
          let cmds = limpiarComandos(menu.help)

          return cmds.map(help => {
            let limit = menu.limit ? ' 🟡' : ''
            let premium = menu.premium ? ' 🔒' : ''
            return `┃ ${emojiM} ${_p}${help}${limit}${premium}`
          }).join('\n')
        })
        .filter(Boolean)
        .join('\n')

      if (!listaComandos.trim()) continue

      menuText += `
╭──「 ${tags[tag]} 」──
${listaComandos}
╰━━━━━━━━━━━⬣
`
    }

    await m.react('⚡️').catch(() => {})

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'

    let groupName = 'WhatsApp'
    try {
      groupName = conn.getName(m.chat) || 'WhatsApp'
    } catch {
      groupName = 'WhatsApp'
    }

    let thumbnail = null

    try {
      let ppUrl = await conn.profilePictureUrl(m.chat, 'image')
      let response = await fetch(ppUrl)
      thumbnail = Buffer.from(await response.arrayBuffer())
    } catch {
      try {
        if (fs.existsSync('./storage/img/catalogo.png')) {
          thumbnail = fs.readFileSync('./storage/img/catalogo.png')
        }
      } catch {}
    }

    const fgrupo = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        id: 'Undefined'
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
      'thumbnail.jpg',
      menuText,
      fgrupo
    )

  } catch (e) {
    console.error('❌ Error en menú:', e)

    try {
      conn.reply(
        m.chat,
        `✖️ Error al mostrar el menú.\n\n${e.message || e}`,
        m
      )
    } catch {}
  }
}

handler.help = ['Menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler

function limpiarComandos(lista) {
  return lista
    .flatMap(cmd =>
      String(cmd || '')
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(x => x.length > 0)
    )
    .filter((cmd, index, array) => array.indexOf(cmd) === index)
}

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}

function getSaludo() {
  let options = {
    timeZone: 'America/Marigot',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  let horaStr = new Date().toLocaleString('es-DO', options)
  let [hora] = horaStr.split(':').map(n => parseInt(n))

  if (hora >= 5 && hora < 12) return `🌅 Buenos días | 🕒 ${horaStr}`
  if (hora >= 12 && hora < 18) return `☀️ Buenas tardes | 🕒 ${horaStr}`
  return `🌙 Buenas noches | 🕒 ${horaStr}`
}
