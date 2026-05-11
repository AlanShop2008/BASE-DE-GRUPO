let handler = async (m, { conn, text, isRowner }) => {

  if (!text) {
    return m.reply('🍃 Debes enviar un emoji o usar:\n' + '• \`.setemoji off\`'
    )
  }

  const input = text.trim().toLowerCase()
  const chat = global.db.data.chats[m.chat] || {}

  if (['off', 'delete', 'remove', 'none', 'reset'].includes(input)) {
    delete chat.customEmoji
    return m.reply('🍃 El emoji del grupo fue eliminado. Ahora se usará el emoji por defecto.')
  }

  if (!isEmoji(text.trim())) {
    return m.reply('🌸 El texto proporcionado no es un emoji válido.')
  }

  chat.customEmoji = text.trim()
  m.reply(`🍃 El emoji del grupo ha sido actualizado correctamente a: ${text.trim()}`)
}

const isEmoji = (text) => {
  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji})$/u
  return emojiRegex.test(text)
}

handler.help = ['setemoji <emoji|off>']
handler.tags = ['group']
handler.command = ['setemoji', 'setemo']
handler.admin = true
handler.group = true

export default handler
