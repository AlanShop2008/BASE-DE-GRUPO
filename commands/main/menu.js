import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'

const botname = global.botname 

let tags = {
  'main': 'INFO 📚',
  'search': 'BUSQUEDA 🔎',
  'group': 'GRUPOS 👥',
  'freefire': 'FREE FIRE 📌',
  'rpg': 'RPG 🌠',
  'rg': 'REGISTRO 📁',
  'sticker': 'STICKERS 🏞',
  'img': 'IMAGENES 📸',
  'nable': 'ON / OFF 📴', 
  'downloader': 'DESCARGAS 📥',
  'tools': 'HERRAMIENTAS 🔧',
  'nsfw': 'NSFW 🔞', 
  'anime': 'ANIME 👑',
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // --- VERIFICACIÓN DE EXPIRACIÓN DE RENTA ---
    if (!global.db.data.botSettings) global.db.data.botSettings = {}
    let settings = global.db.data.botSettings[conn.user.jid] || { expired: 0 }
    
    if (settings.expired && Date.now() > settings.expired) {
      return conn.reply(m.chat, `⚠️ *El tiempo de renta de este Bot ha caducado.*\n\nComunícate con el dueño (*ALAN SHOP*) para renovar el servicio.`, m)
    }
    // -------------------------------------------

    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let name = await conn.getName(userId);

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
        premium: plugin.premium,
      }))
      
    let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    let uptime = Object.values(process.uptime() * 1000)
    const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City", day: 'numeric', month: 'long' })
    let emojiM = global.db.data.chats[m.chat].customEmojiM || '🩵'

    // REGRESAMOS A TU DISEÑO ORIGINAL EXACTO (Corregido CREADOR)
    let menuText = `_*¡𝐇𝐨𝐥𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝@ ${name} 𝐄𝐬𝐩𝐞𝐫𝐨 𝐲 𝐭𝐞𝐧𝐠𝐚𝐬 𝐮𝐧 𝐠𝐫𝐚𝐧 𝐝𝐢𝐚 ☀️!*_

┌────── •• ──────┐
    「 _*𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓*_ 」
└────── •• ──────┘
┃ 💙 _𝖬𝐨𝐝𝐨_ : 𝐏𝐑𝐈𝐕𝐀𝐃𝐎
┃ 💙 _𝐅𝐞𝐜𝐡𝐚_ : ${fecha}
┃ 💙 _𝖢𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐞𝐧 𝐭𝐨𝐭𝐚𝐥_ : ${totalCommands}
┃ 💙 _𝐂𝐑𝐄𝐀𝐃𝐎𝐑_ : *𝐀𝐋𝐀𝐍 𝐒𝐓𝐎𝐑𝐄*
━━━━━━━━━━━━━━━

_*L I S T A - D E - C O M A N D O S*_
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `
╭──「 ${tags[tag]} 」──
${comandos
  .flatMap(menu =>
    menu.help
      .filter(Boolean)
      .map(helpCmd =>
        `┃ ${emojiM} ${_p}${helpCmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
      )
  )
  .join('\n')}
╰━━━━━━━━━━━⬣
`
    }

    await m.react('⚡️')

    let pp = global.db.data.chats[m.chat].customPhotoM || './storage/img/catalogo.png'
    let botNumber = conn.user.jid.split('@')[0]

    // Estructura de Contacto Encriptado Fake VCard (Alan Store MX)
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:𝐀𝐋𝐀𝐍 𝐒𝐓𝐎𝐑𝐄 𝐌𝐗\nORG:Streaming Digital;\nTEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}\nEND:VCARD`

    const fcontacto = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        id: "AlanStoreFake"
      },
      message: {
        contactMessage: {
          displayName: "𝐀𝐋𝐀𝐍 𝐒𝐓𝐎𝐑𝐄",
          vcard: vcard
        }
      }
    }

    await conn.sendMessage(m.chat, {
      image: fs.existsSync(pp) ? fs.readFileSync(pp) : { url: pp },
      caption: menuText,
      mentions: [userId]
    }, { 
      quoted: fcontacto
    })

  } catch (e) {
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
    console.error(e)
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

function getSaludo() {
  let options = {
    timeZone: "America/Marigot",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  }

  let horaStr = new Date().toLocaleString("es-DO", options)
  let [hora] = horaStr.split(":").map(n => parseInt(n))

  if (hora >= 5 && hora < 12) return `🌅 Buenos días | 🕒 ${horaStr}`
  if (hora >= 12 && hora < 18) return `☀️ Buenas tardes | 🕒 ${horaStr}`
  return `🌙 Buenas noches | 🕒 ${horaStr}`
}
