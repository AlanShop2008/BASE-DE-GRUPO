// agregar.js

let handler = async (m, { conn, text, user }) => {

    // Lista de leads/dueños autorizados
    const owners = {
        '123@GUS': 'Diego',
        '456@GUS': 'Abraham'
    }

    // Validar que sea un dueño
    if (!owners[m.sender]) {
        return conn.reply(m.chat, '✖️ Solo los dueños pueden usar este comando.', m)
    }

    // Inicializar base de datos si no existe
    if (!global.db.data.ventas) global.db.data.ventas = {}

    if (!global.db.data.ventas[m.sender]) {
        global.db.data.ventas[m.sender] = {
            total: 0,
            historial: []
        }
    }

    // Separar cantidad y descripción
    let [cantidadStr, ...descripcionArr] = text.split(' ')
    let cantidad = parseFloat(cantidadStr)
    let descripcion = descripcionArr.join(' ') || 'Sin descripción'

    if (!cantidad || isNaN(cantidad)) {
        return conn.reply(
            m.chat,
            '✖️ Ingresa una cantidad válida y opcional descripción\n\nEjemplo:\n.agregar 50 ProductoX',
            m
        )
    }

    // Guardar venta
    global.db.data.ventas[m.sender].total += cantidad
    global.db.data.ventas[m.sender].historial.push({
        cantidad,
        descripcion,
        fecha: new Date().toLocaleString()
    })

    conn.reply(m.chat, `
🔥⋆.˚ 𓂀 ALAN DEV 𓂀 ˚.⋆🔥

✅ Venta agregada correctamente por ${owners[m.sender]}

╭──────────────╮
│ 💵 Cantidad: $${cantidad}
│ 📝 De qué: ${descripcion}
│ 📊 Total: $${global.db.data.ventas[m.sender].total}
│ 🧾 Ventas: ${global.db.data.ventas[m.sender].historial.length}
╰──────────────╯

⚡ Sistema Administrativo
`, m)

}

handler.command = ['agregar', 'sumarventa']
handler.owner = true

export default handler
