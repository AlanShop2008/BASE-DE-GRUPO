// resetventas.js

let handler = async (m, { conn }) => {

global.db.data.ventas = {
total: 0,
historial: []
}

conn.reply(m.chat, `
♻️ Sistema reiniciado

🗑️ Ventas eliminadas
💰 Total reiniciado a $0
`, m)

}

handler.command = ['resetventas', 'borrarventas']
handler.owner = true

export default handler
