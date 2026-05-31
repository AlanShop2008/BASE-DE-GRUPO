let handler = async (m, { conn, text }) => {
  if (!m.fromMe) return m.reply('⚠️ Solo el creador puede usar este comando')
  let cantidad = parseFloat(text)
  if (!cantidad || isNaN(cantidad)) return conn.reply(m.chat, '✖️ Ingresa una cantidad válida', m)

  if (!global.db.data.ventas) global.db.data.ventas = { total: 0, historial: [] }

  global.db.data.ventas.total += cantidad
  global.db.data.ventas.historial.push(cantidad)

  conn.reply(m.chat, `✅ Venta agregada\n💵 Cantidad: $${cantidad}\n📊 Total acumulado: $${global.db.data.ventas.total}`, m)
}

handler.command = ['agregar', 'add']
handler.owner = true
export default handler
