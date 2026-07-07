import fs from 'fs'

let tags = {
  main: 'INFO',
  search: 'BÚSQUEDA',
  group: 'GRUPOS',
  freefire: 'FREE FIRE',
  rpg: 'RPG',
  rg: 'REGISTRO',
  sticker: 'STICKERS',
  img: 'IMÁGENES',
  nable: 'ON / OFF',
  downloader: 'DESCARGAS',
  tools: 'HERRAMIENTAS',
  nsfw: 'NSFW',
  anime: 'ANIME'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let name = await conn.getName(userId)

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
        tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
        limit: plugin.limit,
        premium: plugin.premium
      }))

    let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length
    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    const fecha = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    let emojiM = global.db.data.chats[m.chat]?.customEmojiM || '✦'

    let menuText = `
╭━━━〔 *ALAN STORE BOT* 〕━━━╮
┃ 🤖 *Sistema Premium*
┃ ✅ *WhatsApp Style*
┃ 👤 Usuario: *${name}*
┃ 📅 Fecha: *${fecha}*
┃ 📊 Comandos: *${totalCommands}*
┃ 👥 Usuarios: *${totalUsers}*
┃ 💎 Premium: *${totalPremium}*
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭──〔 *GUÍA* 〕──╮
┃ 🟡 Límite
┃ 🔑 Premium
┃ ${emojiM} Comando disponible
╰━━━━━━━━━━━━━━╯
`.trim()

    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `\n\n╭──〔 *${tags[tag]}* 〕──╮\n`

      comandos.forEach(menu => {
        menu.help.forEach(help => {
          let badge = ''
          if (menu.limit) badge += ' 🟡'
          if (menu.premium) badge += ' 🔑'
          menuText += `┃ ${emojiM} *${_p}${help}*${badge}\n`
        })
      })

      menuText += `╰━━━━━━━━━━━━━━╯`
    }

    menuText += `

╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🚀 *Alan Store™*
┃ 🖤 Bot optimizado por Alan Shop
╰━━━━━━━━━━━━━━━━━━━━━━╯`

    await m.react('🌸')

    let pp = global.db.data.chats[m.chat]?.customPhotoM || './storage/img/catalogo.png'

    await conn.sendFile(
      m.chat,
      pp,
      'menu.jpg',
      menuText,
      m,
      false
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al mostrar el menú.\n\n${e}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']

export default handler