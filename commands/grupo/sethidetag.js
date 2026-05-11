let handler = async (m, { conn, text }) => {
  
  const chat = global.db.data.chats[m.chat] || {}
  const input = (text || '').trim().toLowerCase()

  if (['off', 'delete', 'remove', 'none', 'reset'].includes(input)) {
    delete chat.customTextH
    return m.reply('🍃 El texto personalizado del hidetag fue eliminado. Ahora se usará el texto por defecto.')
  }

  chat.customTextH = text.trim()
  m.reply(`🍃 El texto del hidetag ha sido actualizado correctamente a:\n"${text.trim()}"`)
}

handler.help = ['sethidetag <texto|off>']
handler.tags = ['group']
handler.command = ['sethidetag', 'setn']
handler.admin = true
handler.group = true

export default handler
