```js
import fs from 'fs'
import path from 'path'

let handler = async (m, { args, conn }) => {

  if (args.length < 2) {
    return m.reply('Uso:\n.constancia RFC IDCIF')
  }

  let rfc = args[0]
  let idcif = args[1]

  await m.reply('🔄 Generando constancia PDF...')

  try {

    // Contenido PDF falso de prueba
    const contenido = `
CONSTANCIA DE SITUACIÓN FISCAL

RFC: ${rfc}

IDCIF: ${idcif}

Fecha: ${new Date().toLocaleDateString()}

Documento generado desde tu bot.
`

    // Ruta temporal
    const filePath = path.join('./tmp', `${rfc}.pdf`)

    // Crear carpeta tmp si no existe
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp')
    }

    // Crear archivo PDF falso
    fs.writeFileSync(filePath, contenido)

    // Enviar archivo
    await conn.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(filePath),
        mimetype: 'application/pdf',
        fileName: `Constancia_${rfc}.pdf`
      },
      { quoted: m }
    )

    // Borrar archivo temporal
    fs.unlinkSync(filePath)

  } catch (e) {

    console.log(e)

    await m.reply('❌ Error generando PDF')

  }

}

handler.help = ['constancia']
handler.tags = ['main']
handler.command = ['constancia']
handler.owner = true

export default handler
```
