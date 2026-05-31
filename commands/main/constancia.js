```js
import fs from 'fs'

let handler = async (m, { args, conn }) => {

  if (args.length < 2) {
    return m.reply('Uso:\n.constancia RFC IDCIF')
  }

  let rfc = args[0]
  let idcif = args[1]

  try {

    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp')
    }

    const filename = `./tmp/${rfc}.txt`

    const contenido = `
CONSTANCIA DE SITUACION FISCAL

RFC: ${rfc}

IDCIF: ${idcif}

FECHA: ${new Date().toLocaleDateString()}

DOCUMENTO GENERADO POR EL BOT
`

    fs.writeFileSync(filename, contenido)

    await conn.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(filename),
        mimetype: 'text/plain',
        fileName: `Constancia_${rfc}.txt`
      },
      { quoted: m }
    )

    fs.unlinkSync(filename)

  } catch (e) {

    console.log(e)

    m.reply('Error')

  }

}

handler.help = ['constancia']
handler.tags = ['main']
handler.command = ['constancia']
handler.owner = true

export default handler
```
