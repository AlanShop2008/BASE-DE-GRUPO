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

    let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City", day: 'numeric', month: 'long' })
    let emojiM = (global.db.data.chats[m.chat] && global.db.data.chats[m.chat].customEmojiM) || '🩵'

    let menuText = `_*¡𝐇𝐨𝐥𝐚 𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝@ ${name} 𝐄𝐬𝐩𝐞𝐫𝐨 𝐲 𝐭𝐞𝐧𝐠𝐚𝐬 𝐮𝐧 𝐠𝐫𝐚𝐧 𝐝𝐢𝐚 ☀️!*_

┌────── •• ──────┐
    「 _*𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓*_ 」
└────── •• ──────┘
┃ 💙 _𝖬𝐨𝐝𝐨_ : 𝐏𝐑𝐈𝐕𝐀𝐃𝐎
┃ 💙 _𝐅𝐞𝐜𝐡𝐚_ : ${fecha}
┃ 💙 _𝖢𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐞𝐧 𝐭𝐨𝐭𝐚𝐥_ : ${totalCommands}
┃ 💙 _𝖢𝖱𝖤𝐀𝐃𝐎𝐑_ : *𝐀𝐋𝐀𝐍 𝐒𝐇𝐎𝐏*
━━━━━━━━━━━━━━━

_*L I S T A - D E - C O M A N D O S*_
`

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium,
      }))

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `
╭──「 ${tags[tag]} 」──
${comandos.map(menu =>
  menu.help.map(help =>
    `┃ ${emojiM} ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
  ).join('\n')
).join('\n')}
╰━━━━━━━━━━━⬣
`
    }

    await m.react('⚡️')

    // Configuración de imagen
    let pp = './storage/img/catalogo.png'
    if (!fs.existsSync(pp)) {
        pp = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png' // Imagen de respaldo si no existe el archivo
    }

    let ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png'
    try {
      const profile = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null)
      if (profile) ppUrl = profile
    } catch (e) {}

    // ENVÍO FINAL SIN REENVIADO
    await conn.sendFile(m.chat, pp, 'menu.jpg', menuText, m, false, {
      mentions: [m.sender],
      contextInfo: {
        forwardingScore: 0,
        isForwarded: false,
        externalAdReply: {
          title: 'WhatsApp ✅', 
          body: 'Alan Shop • Bot Service',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: false,
          thumbnailUrl: ppUrl,
          sourceUrl: 'https://atom.bio/alanshop' 
        }
      }
    })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
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
