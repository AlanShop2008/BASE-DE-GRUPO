global.mutedUsers = global.mutedUsers || {}

let handler = async (m, { conn, command, text }) => {
  if (!text && !m.quoted && !m.mentionedJid?.length) {
    return conn.reply(m.chat, `🔇 *Debes responder, mencionar o escribir un número para usar ${command}.*`, m)
  }

  let mentionedJid = await m.mentionedJid
  let user = mentionedJid && mentionedJid.length 
    ? mentionedJid[0] 
    : m.quoted && await m.quoted.sender 
      ? await m.quoted.sender 
      : null

  if (!user) return

  global.mutedUsers[m.chat] = global.mutedUsers[m.chat] || []

  if (command === 'mute') {
    if (global.mutedUsers[m.chat].includes(user)) {
      return m.reply(`✳️ El usuario ya está muteado`)
    }
    global.mutedUsers[m.chat].push(user)
    m.reply(`🔇 Usuario @${user.split('@')[0]} ha sido muteado`, null, { mentions: [user] })
    await m.react('🔇')
  }

  if (command === 'unmute') {
    if (!global.mutedUsers[m.chat].includes(user)) {
      return m.reply(`✳️ El usuario no está muteado`)
    }
    global.mutedUsers[m.chat] = global.mutedUsers[m.chat].filter(u => u !== user)
    m.reply(`🔊 Usuario @${user.split('@')[0]} ha sido desmuteado`, null, { mentions: [user] })
    await m.react('🔊')
  }
}

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  global.mutedUsers[m.chat] = global.mutedUsers[m.chat] || []

  if (global.mutedUsers[m.chat].includes(m.sender)) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key })
    } catch (e) {
      console.error('Error al eliminar mensaje:', e)
    }
  }
}

handler.help = ['mute @user', 'unmute @user']
handler.tags = ['group']
handler.command = ['mute', 'unmute']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
