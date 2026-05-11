import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, "confDB.json")
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}")

async function handler(m, { conn }) {
  let db = JSON.parse(fs.readFileSync(dbPath))

  const groupId = m.chat
  let groupName = ""
  try {
    const meta = await conn.groupMetadata(m.chat)
    groupName = meta.subject || ""
  } catch (e) {
    groupName = ""
  }

  if (!db[groupId] || Object.keys(db[groupId]).length === 0) {
    return conn.reply(m.chat, "⚠️ NO HAY COMANDOS CREADOS EN ESTE GRUPO", m)
  }

  let lista = Object.keys(db[groupId])
    .map(nombre => `> 🔧 .conf${nombre}\n> 🚀 .${nombre}`)
    .join("\n\n")

  return conn.reply(
    m.chat,
    `📜 LISTA DE COMANDOS DISPONIBLES EN ${groupName}\n\n${lista}`,
    m
  )
}

handler.help = ["listarconf"]
handler.tags = ["main"]
handler.command = /^listarconf$/i

export default handler
