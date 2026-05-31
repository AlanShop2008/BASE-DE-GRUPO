let handler = async (m, { conn }) => {
  if (!m.fromMe) return m.reply('⚠️ Solo el creador puede usar este comando')

  if (!global.db.data.ventas) global.db.data.ventas = { total: 0, historial: [] }

  let total = global.db.data.ventas.total
  let cantidadVentas = global.db.data.ventas.historial.length
  let fecha = new Date().toLocaleDateString('es-ES')

  conn.reply(m.chat, `🔥 RESUMEN DE VENTAS\n\n💰 Total vendido: $${total}\n🧾 Ventas registradas: ${cantidadVentas}\n📅 Fecha: ${fecha}`, m)
}

handler.command = ['totalvendido', 'total']
handler.owner = true
export default handler
