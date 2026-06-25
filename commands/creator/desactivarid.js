import fs from 'fs'

const carpeta = './database'
const archivo = './database/grupos_desactivados.json'

if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta)
if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, '[]')

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.')

  let id = args[0] || m.chat

  if (!id.endsWith('@g.us')) {
    return m.reply('❌ Ese ID no parece ser de grupo.\n\nEjemplo:\n.desactivarid 120363xxxx@g.us')
  }

  let grupos = JSON.parse(fs.readFileSync(archivo))

  if (grupos.includes(id)) {
    return m.reply('⚠️ Ese grupo ya está desactivado.')
  }

  grupos.push(id)
  fs.writeFileSync(archivo, JSON.stringify(grupos, null, 2))

  return m.reply(`✅ Bot desactivado correctamente en este grupo:\n\n${id}`)
}

handler.command = ['desactivarid']
handler.owner = true

export default handler
