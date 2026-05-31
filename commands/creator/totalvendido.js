let handler = async (m, { conn }) => {

if (!m.fromMe) {
return m.reply('⚠️ Solo el creador puede usar este comando')
}

if (!global.db.data.ventas) {
global.db.data.ventas = {
total: 0,
historial: []
}
}

let total = global.db.data.ventas.total
let cantidadVentas = global.db.data.ventas.historial.length

let promedio = cantidadVentas
? (total / cantidadVentas).toFixed(2)
: 0

let mayor = cantidadVentas
? Math.max(...global.db.data.ventas.historial)
: 0

let fecha = new Date().toLocaleDateString('es-ES', {
timeZone: 'America/Mexico_City'
})

let texto = `
🔥⋆.˚ 𓂀 ALAN DEV 𓂀 ˚.⋆🔥

╭──────────────╮
│ 💰 Total: $${total}
│ 🧾 Ventas: ${cantidadVentas}
│ 📈 Promedio: $${promedio}
│ 🏆 Mayor venta: $${mayor}
│ 📅 Fecha: ${fecha}
╰──────────────╯

╭┈┈⊰ 📊 RESUMEN
┊ 🔹 Sistema activo
┊ 🔹 Ventas registradas
┊ 🔹 Datos guardados
╰┈┈┈┈┈┈┈┈⊰

⚡ ALAN DEV PREMIUM
🛒 Sistema Administrativo
`

conn.reply(m.chat, texto, m)

}

handler.command = ['totalvendido', 'ventasdia', 'ganancias']
handler.owner = true

export default handler
