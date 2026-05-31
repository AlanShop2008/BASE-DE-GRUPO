// agregar.js

let handler = async (m, { conn, text }) => {

if (!global.db.data.ventas) {
global.db.data.ventas = {
total: 0,
historial: []
}
}

let cantidad = parseFloat(text)

if (!cantidad || isNaN(cantidad)) {
return conn.reply(
m.chat,
'✖️ Ingresa una cantidad válida\n\nEjemplo:\n.agregar 50',
m
)
}

global.db.data.ventas.total += cantidad
global.db.data.ventas.historial.push(cantidad)

conn.reply(m.chat, `
🔥⋆.˚ 𓂀 ALAN DEV 𓂀 ˚.⋆🔥

✅ Venta agregada correctamente

╭──────────────╮
│ 💵 Cantidad: $${cantidad}
│ 📊 Total: $${global.db.data.ventas.total}
│ 🧾 Ventas: ${global.db.data.ventas.historial.length}
╰──────────────╯

⚡ Sistema Administrativo
`, m)

}

handler.command = ['agregar', 'sumarventa']
handler.owner = true

export default handler
