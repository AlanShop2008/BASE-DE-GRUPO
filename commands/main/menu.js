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
    const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City", day: 'numeric', month: 'long' })
    let emojiM = global.db.data.chats[m.chat].customEmojiM || '⚡'

    // DISEÑO RADICALMENTE NUEVO: ESTILO MINIMALISTA Y LIMPIO
    let menuText = `✨ *¡Hola, ${name}!*
Espero que tengas un excelente día.

╔════════════════════╗
   🪐  *${botname || 'WAVE BOT'}*  🪐
╚════════════════════╝
 👤 *Creador:* Alan Shop
 🕒 *Fecha:* ${fecha}
 📊 *Comandos:* [ ${totalCommands} ]
 🔒 *Acceso:* Premium habilitado

💡 _Abreviaturas: 🟡 Límite | 🔑 Premium_
 ────────────────────
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      // Título de la categoría centrado visualmente
      menuText += `\n🔹 *[ ${tags[tag]} ]* 🔹\n`
      
      comandos.map(menu =>
        menu.help.map(help => {
          let badge = menu.limit ? ' 🟡' : ''
          badge += menu.premium ? ' 🔑' : ''
          // Formato ultra limpio para los comandos
          menuText += `  ${emojiM}  \`${_p}${help}\`${badge}\n`
        })
      )
    }

    menuText += `\n────────────────────\n⚡ _Bot optimizado por Alan Shop_`

    await m.react('⚡️')

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
        id: "Undefined"
      },
      message: {
        locationMessage: {
          name: groupName, 
          jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
        }
      }
    };
    
    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, fgrupo, m, fake)
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
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
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
