let handler = async (m, { conn }) => {
  if (!m.fromMe) return m.reply('⚠️ Solo el creador puede usar este comando')

  if (!global.db.data.ventas) global.db.data.ventas = { total: 0, historial: [] }

  if (!global.db.data.ventas.historial.length) return conn.reply(m.chat, '❌ No hay ventas registradas aún', m)

  let lista = global.db.data.ventas.historial.map((v, i) => `${i + 1}. +$${v}`).join('\n')

  conn.reply(m.chat, `📋 HISTORIAL DE VENTAS\n\n${lista}`, m)
}

handler.command = ['historial', 'ventas']
handler.owner = true
export default handler
