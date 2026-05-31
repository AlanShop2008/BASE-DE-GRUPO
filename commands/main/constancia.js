import puppeteer from 'puppeteer'

let handler = async (m, { args, conn }) => {

  if (args.length < 2) {
    return m.reply('Uso:\n.constancia RFC IDCIF')
  }

  let rfc = args[0]
  let idcif = args[1]

  await m.reply('Generando constancia...')

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()

  // Abrir SAT
  await page.goto('https://www.sat.gob.mx')

  // Aquí irá:
  // escribir RFC
  // escribir IDCIF
  // generar constancia
  // descargar PDF

  await browser.close()

  await m.reply('Proceso terminado')

}

handler.help = ['constancia']
handler.tags = ['main']
handler.command = ['constancia']
handler.owner = true

export default handler
