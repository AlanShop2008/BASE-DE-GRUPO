import axios from 'axios'

let handler = async (m, { args }) => {

  if (args.length < 2) {
    return m.reply('Uso:\n.constancia RFC IDCIF')
  }

  let rfc = args[0]
  let idcif = args[1]

  await m.reply('🔄 Consultando constancia...')

  try {

    // Ejemplo de petición
    const response = await axios.get(`https://api.sat.fake/constancia?rfc=${rfc}&idcif=${idcif}`)

    // Aquí recibirías PDF o datos
    console.log(response.data)

    await m.reply('✅ Consulta realizada')

  } catch (e) {

    console.log(e)

    await m.reply('❌ Error consultando SAT')

  }

}

handler.help = ['constancia']
handler.tags = ['main']
handler.command = ['constancia']
handler.owner = true

export default handler
