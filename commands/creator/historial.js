// historial.js

let handler = async (m, { conn }) => {

if (!global.db.data.ventas) {
global.db.data.ventas = {
total: 0,
historial: []
}
}

if (!global.db.data.ventas.historial.length) {
return conn.reply(
m.chat,
'❌ No hay ventas registradas',
m
)
}

let lista = global.db.data.ventas.historial
.map((v, i) => `┊ 🔹 Venta ${i + 1}: $${v}`)
.join('\n')

conn.reply(m.chat, `
🔥⋆.˚ 𓂀 ALAN DEV 𓂀 ˚.⋆🔥

╭┈┈⊰ 📋 HISTORIAL
${lista}
╰┈┈┈┈┈┈┈┈⊰

💰 Total acumulado:
$${global.db.data.ventas.total}

⚡ Sistema Administrativo
`, m)

}

handler.command = ['historial', 'ventas']
handler.owner = true

export default handler
