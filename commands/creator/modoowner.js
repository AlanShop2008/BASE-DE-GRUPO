import fs from 'fs'

const file = './database/grupos-owner.json'

function loadDB() {
  if (!fs.existsSync('./database')) fs.mkdirSync('./database')
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([], null, 2))
  return JSON.parse(fs.readFileSync(file))
}

function saveDB(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn, args, isROwner }) => {
  if (!isROwner) return

  let id = args[0]

  if (!id) {
    return conn.reply(
      m.chat,
      `⚙️ Uso correcto:\n\n.modoowner id\n\nEjemplo:\n.modoowner 120363123456789@g.us`,
      m
    )
  }

  let db = loadDB()

  if (db.includes(id)) {
    db = db.filter(g => g !== id)
    saveDB(db)

    return conn.reply(
      m.chat,
      `✅ Modo Owner desactivado para este grupo:\n\n${id}`,
      m
    )
  } else {
    db.push(id)
    saveDB(db)

    return conn.reply(
      m.chat,
      `🔒 Modo Owner activado para este grupo:\n\n${id}\n\nAhora solo el owner podrá usar el bot ahí.`,
      m
    )
  }
}

handler.command = /^modoowner$/i
handler.owner = true

export default handler