let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!global.db.data.botSettings) global.db.data.botSettings = {}
  
  // Comando para quitar la renta y dejar el bot ilimitado
  if (command === 'desactivarbot') {
    global.db.data.botSettings[conn.user.jid] = { expired: 0 }
    return m.reply(`✅ *El sistema de renta ha sido desactivado.* El bot ahora es ilimitado.`)
  }

  if (!text) return m.reply(`⚠️ *Uso correcto del comando:*\n${usedPrefix + command} 30d\n${usedPrefix + command} 12h\n${usedPrefix + command} 45m\n\n_(d = Días, h = Horas, m = Minutos)_`)

  // Detectar la extensión (d, h, m) y el número
  let extension = text.toLowerCase().replace(/[^dhm]/g, '')
  let valor = parseInt(text.replace(/[^0-9]/g, ''))

  if (isNaN(valor) || !extension) return m.reply(`❌ Formato inválido. Ejemplo: \`${usedPrefix + command} 30d\``)

  // Calcular el tiempo en milisegundos
  let tiempoMs = 0
  if (extension === 'd') tiempoMs = valor * 24 * 60 * 60 * 1000
  if (extension === 'h') tiempoMs = valor * 60 * 60 * 1000
  if (extension === 'm') tiempoMs = valor * 60 * 1000

  let fechaExpiracion = Date.now() + tiempoMs
  
  // Guardar en la base de datos global del bot
  global.db.data.botSettings[conn.user.jid] = {
    expired: fechaExpiracion
  }

  let fechaFormateada = new Date(fechaExpiracion).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })

  m.reply(`🚀 *Renta Establecida Exitosamente*\n\nEl bot funcionará durante *${valor}* ${extension === 'd' ? 'días' : extension === 'h' ? 'horas' : 'minutos'}.\n*Fecha de apagado:* ${fechaFormateada}`)
}

handler.help = ['activar', 'desactivarbot']
handler.tags = ['owner']
handler.command = ['activar', 'rentar', 'desactivarbot']
handler.rowner = true // IMPORTANTE: Solo tú como dueño puedes usarlo

export default handler
