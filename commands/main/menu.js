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
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium,
      }))

    let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

    const fecha = new Date().toLocaleDateString("es-ES", {
      timeZone: "America/Mexico_City",
      day: 'numeric',
      month: 'long'
    })

    let emojiM = global.db.data.chats[m.chat]?.customEmojiM || '🌸'

    let menuText = `*☁️ ───  ¡Hola, ${name}!  ─── ☁️*
*Tengan un día mágico y lleno de destellos ✨*

🌟 ┈┈┈┈┈┈┈┈┈┈┈┈ 🌟
 ୨୧  *INFO DEL BOT*  ୨୧
🌟 ┈┈┈┈┈┈┈┈┈┈┈┈ 🌟
 ☁️ *Creador:* Alan Shop
 📅 *Fecha:* \`${fecha}\`
 📊 *Comandos:* \`[ ${totalCommands} ]\`
 🔒 *Modo:* _Privado_ 🎀

_Guía: 🟡 Límite | 🔑 Premium_
 🌸 ┈┈┈┈┈┈┈┈┈┈┈┈ 🌸
`

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `\n*⋆  [ ${tags[tag]} ]  ⋆*\n`
      
      comandos.map(menu =>
        menu.help.map(help => {
          let badge = menu.limit ? ' 🟡' : ''
          badge += menu.premium ? ' 🔑' : ''
          menuText += ` • ${emojiM} *${_p}${help}*${badge}\n`
        })
      )
    }

    menuText += `\n🌸 ┈┈┈┈┈┈┈┈┈┈┈┈ 🌸\n✨ _Bot optimizado con amor por Alan Shop_ 🎀`

    await m.react('🌸')

    let pp = global.db.data.chats[m.chat]?.customPhotoM || './storage/img/catalogo.png'

    const fakeWhatsAppBusiness = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        locationMessage: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          name: 'WhatsApp Business ✅ • Estado',
          address: 'Contacto',
          jpegThumbnail: fs.readFileSync('./storage/img/fake.jpg')
        }
      }
    }

    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, fakeWhatsAppBusiness, false)

  } catch (e) {
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['Menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler