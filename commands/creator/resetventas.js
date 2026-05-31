let handler = async (m, { conn }) => {
  if (!m.fromMe) return m.reply('⚠️ Solo el creador puede usar este comando')

  global.db.data.ventas = { total: 0, historial: [] }
  conn.reply(m.chat, '♻️ Historial y total de ventas reiniciado', m)
}

handler.command = ['resetventas']
handler.owner = true
export default handler
