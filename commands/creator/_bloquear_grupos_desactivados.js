import fs from 'fs'

const file = './database/grupos_desactivados.json'

function loadDB() {
  if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true })
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2))
  }

  return JSON.parse(fs.readFileSync(file))
}

export async function before(m, { conn, isOwner }) {
  if (!m.isGroup) return false

  let db = loadDB()

  // Si el grupo no está desactivado, el bot funciona normal
  if (!db.includes(m.chat)) return false

  let texto = (m.text || '').trim().toLowerCase()

  // ÚNICA excepción:
  // Solo el owner puede activar otra vez el bot
  if (
    isOwner &&
    (
      texto.startsWith('.activarid') ||
      texto.startsWith('activarid')
    )
  ) {
    return false
  }

  // Aquí se bloquea TODO
  // No responde menú, comandos, stickers, descargas, juegos, nada
  return true
}
