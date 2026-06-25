import fs from 'fs'

const carpeta = './database'
const archivo = './database/grupos_desactivados.json'

if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true })
if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, '[]')

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.')

  let id = args[0] || m.chat

  let grupos = JSON.parse(fs.readFileSync(archivo))

  if (!grupos.includes(id)) {
    return m.reply('⚠️ Ese grupo no estaba desactivado.')
  }

  grupos = grupos.filter(g => g !== id)
  fs.writeFileSync(archivo, JSON.stringify(grupos, null, 2))

  return m.reply(`✅ Bot activado nuevamente en:\n\n${id}`)
}

handler.command = ['activarid']
handler.owner = true

export default handler
