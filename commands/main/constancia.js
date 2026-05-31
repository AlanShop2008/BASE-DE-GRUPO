let handler = async (m, { args }) => {

  if (args.length < 2) {
    return m.reply('Uso:\n.constancia RFC IDCIF')
  }

  let rfc = args[0]
  let idcif = args[1]

  await m.reply(`Consultando constancia de:\n${rfc}\nIDCIF: ${idcif}`)

  // Aquí irá la lógica del SAT

}

handler.help = ['constancia']
handler.tags = ['main']
handler.command = ['constancia']

handler.owner = true

export default handler
