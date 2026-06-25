import fs from 'fs'

const carpeta = './database'
const archivo = './database/grupos_desactivados.json'

if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true })
if (!fs.existsSync(archivo)) fs.writeFileSync(archivo, '[]')

function leerDesactivados() {
  try {
    return JSON.parse(fs.readFileSync(archivo))
  } catch {
    return []
  }
}

let handler = async (m, { isOwner }) => {
  if (!m.isGroup) return false

  let grupos = leerDesactivados()

  if (!grupos.includes(m.chat)) return false

  let texto = m.text || ''
  let comando = texto.trim().split(/\s+/)[0].toLowerCase()

  let permitidos = [
    '.activarid',
    '.desactivarid',
    '.grupos',
    '.listagrupos'
  ]

  if (permitidos.includes(comando)) return false

  return true
}

handler.before = handler

export default handler
