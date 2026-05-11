let handler = async (m, { conn, text }) => {
  
  const chat = global.db.data.chats[m.chat] || {}
  const input = (text || '').trim().toLowerCase()

  if (['off', 'delete', 'remove', 'none', 'reset'].includes(input)) {
    delete chat.customPhotoM
    return m.reply('🍃 La foto personalizada del menú fue eliminada. Ahora se usará la foto por defecto.')
  }

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !mime.startsWith('image/')) {
    return m.reply('🌸 Debes enviar una imagen válida para el menú.')
  }

  let img = await q.download?.()
  if (!img) return m.reply('⚠️ No se pudo descargar la imagen.')

  chat.customPhotoM = img
  m.reply('🍃 La foto del menú ha sido actualizada correctamente.')
}

handler.help = ['setfoto <imagen|off>']
handler.tags = ['group']
handler.command = ['setfoto', 'setfotomenu']
handler.admin = true
handler.group = true

export default handler
