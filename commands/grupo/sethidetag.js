let handler = async (m, { text, usedPrefix, command }) => {
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  const chat = global.db.data.chats[m.chat]
  const input = (text || '').trim()

  if (!input) {
    return m.reply(`🍃 Usa así:\n\n${usedPrefix + command} ROKO-BOT\n\nPara quitarlo:\n${usedPrefix + command} off`)
  }

  if (['off', 'reset', 'delete', 'remove', 'none'].includes(input.toLowerCase())) {
    delete chat.customFooter
    return m.reply('🍃 Footer personalizado eliminado. Ahora se usará el nombre normal del bot.')
  }

  chat.customFooter = input

  m.reply(`✅ Footer personalizado actualizado:\n\n${input}`)
}

handler.help = ['setn <texto|off>']
handler.tags = ['group']
handler.command = /^(setn|setfooter|setfirma)$/i
handler.admin = true
handler.group = true

export default handler
