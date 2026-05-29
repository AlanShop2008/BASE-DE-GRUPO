import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, "confDB.json")
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}")

let db = JSON.parse(fs.readFileSync(dbPath))

const excluidos = [
  "crearconf", "delconf", "eliminarconf", "eliminarset", "listarconf",
  "listset", "setbanner", "menu", "allmenu", "menú"
]

const DIGITS = (s = "") => String(s).replace(/\D/g, "")

function unwrapMessage(m) {
  let node = m
  while (
    node?.viewOnceMessage?.message ||
    node?.viewOnceMessageV2?.message ||
    node?.viewOnceMessageV2Extension?.message ||
    node?.ephemeralMessage?.message
  ) {
    node =
      node.viewOnceMessage?.message ||
      node.viewOnceMessageV2?.message ||
      node.viewOnceMessageV2Extension?.message ||
      node.ephemeralMessage?.message
  }
  return node
}

function getQuotedText(msg) {
  const q = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!q) return null
  const inner = unwrapMessage(q)
  return inner?.conversation || inner?.extendedTextMessage?.text || null
}

function getQuotedImageMessage(msg) {
  const q = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!q) return null
  const inner = unwrapMessage(q)
  return inner?.imageMessage || null
}

function isOwnerNumber(sender) {
  const senderNum = DIGITS(sender || "")
  const owners = Array.isArray(global.owner) ? global.owner : []
  return owners.some(([id]) => DIGITS(id) === senderNum)
}

async function isGroupAdmin(conn, chat, sender) {
  try {
    const meta = await conn.groupMetadata(chat)
    const participant = meta.participants.find(p => p.id === sender)
    return participant?.admin === "admin" || participant?.admin === "superadmin"
  } catch {
    return false
  }
}

async function saveConfig(nombre, groupId, texto, imageMessage, quotedImageMessage) {
  let mediaPath = null

  if (imageMessage) {
    const stream = await downloadContentFromMessage(imageMessage, "image")
    let buffer = Buffer.alloc(0)
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    mediaPath = path.join(__dirname, `conf_${groupId.replace(/[^a-zA-Z0-9]/g, "_")}_${nombre}.jpg`)
    fs.writeFileSync(mediaPath, buffer)
  }

  if (quotedImageMessage) {
    const stream = await downloadContentFromMessage(quotedImageMessage, "image")
    let buffer = Buffer.alloc(0)
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    mediaPath = path.join(__dirname, `conf_${groupId.replace(/[^a-zA-Z0-9]/g, "_")}_${nombre}.jpg`)
    fs.writeFileSync(mediaPath, buffer)
  }

  db[groupId][nombre].value = {}
  if (texto) db[groupId][nombre].value.texto = texto
  if (mediaPath) db[groupId][nombre].value.media = mediaPath

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

async function handler(m, { conn, command, text }) {
  const groupId = m.chat

  if (!m.isGroup) {
    return conn.reply(m.chat, "> ⚠️ Este comando solo funciona en grupos.", m)
  }

  let groupName = ""
  try {
    const meta = await conn.groupMetadata(m.chat)
    groupName = meta.subject || ""
  } catch {
    groupName = ""
  }

  const isOwner = isOwnerNumber(m.sender)
  const isAdmin = await isGroupAdmin(conn, m.chat, m.sender)

  // Crear comando rápido: .setpito texto
  if (command.startsWith("set") && command.length > 3) {
    if (!isOwner && !isAdmin) {
      return conn.reply(m.chat, "> 🚫 Solo admins u owners pueden crear comandos.", m)
    }

    const nombre = command.replace(/^set/i, "").toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, "")

    if (!nombre) {
      return conn.reply(m.chat, "> ⚠️ Nombre inválido.", m)
    }

    let texto = text && text.trim() ? text.trim() : null
    const imageMessage = m.message?.imageMessage || null
    const quotedImageMessage = getQuotedImageMessage(m)
    const quotedText = !texto ? getQuotedText(m) : null

    if (!texto && quotedText) texto = quotedText

    if (!texto && !imageMessage && !quotedImageMessage) {
      return conn.reply(
        m.chat,
        `⚠️ Uso correcto:\n\n` +
        `> .set${nombre} <texto>\n\n` +
        `Ejemplo:\n` +
        `> .set${nombre} tacos 7 pesos\n\n` +
        `Luego úsalo con:\n` +
        `> .${nombre}`,
        m
      )
    }

    if (!db[groupId]) db[groupId] = {}

    const mediaAnterior = db[groupId][nombre]?.value?.media
    if (mediaAnterior && fs.existsSync(mediaAnterior)) fs.unlinkSync(mediaAnterior)

    db[groupId][nombre] = {
      confCmd: `conf${capitalize(nombre)}`,
      setCmd: nombre,
      value: null
    }

    await saveConfig(nombre, groupId, texto, imageMessage, quotedImageMessage)

    return conn.reply(
      m.chat,
      `✅ Comando creado correctamente.\n\n> Usa: .${nombre}`,
      m
    )
  }

  // Crear comando antiguo: .crearconf tacos
  if (command === "crearconf") {
    if (!isOwner) {
      return conn.reply(m.chat, "> 🚫 SOLO EL CREADOR PUEDE USAR ESTE COMANDO", m)
    }

    const nombre = text.trim().toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, "")
    if (!nombre) return conn.reply(m.chat, "> ⚠️ DEBES INDICAR UN NOMBRE", m)

    const confCmd = `conf${capitalize(nombre)}`
    const setCmd = nombre

    if (!db[groupId]) db[groupId] = {}
    db[groupId][nombre] = { confCmd, setCmd, value: null }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

    return conn.reply(
      m.chat,
      `✨ SE HAN CREADO LOS COMANDOS:\n\n` +
      `> 🔧 .${confCmd}\n` +
      `> 🚀 .${setCmd}`,
      m
    )
  }

  // Eliminar comando: .delconf tacos
  if (command === "delconf") {
    if (!isOwner && !isAdmin) {
      return conn.reply(m.chat, "> 🚫 SOLO ADMINS U OWNERS PUEDEN ELIMINAR COMANDOS", m)
    }

    const nombre = text.trim().toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, "")
    if (!nombre) return conn.reply(m.chat, "> ⚠️ DEBES INDICAR EL NOMBRE DEL COMANDO A ELIMINAR", m)

    if (!db[groupId] || !db[groupId][nombre]) {
      return conn.reply(m.chat, "> ⚠️ ESE COMANDO NO EXISTE EN ESTE GRUPO", m)
    }

    const mediaPath = db[groupId][nombre].value?.media
    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)

    delete db[groupId][nombre]

    if (Object.keys(db[groupId]).length === 0) delete db[groupId]

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

    return conn.reply(m.chat, `🗑️ El comando ".${nombre}" fue eliminado.`, m)
  }

  // Listar comandos creados
  if (command === "listarconf" || command === "listset") {
    if (!db[groupId] || !Object.keys(db[groupId]).length) {
      return conn.reply(m.chat, "⚠️ No hay comandos personalizados en este grupo.", m)
    }

    const lista = Object.keys(db[groupId]).map((cmd, i) => `${i + 1}. .${cmd}`).join("\n")

    return conn.reply(
      m.chat,
      `📋 *COMANDOS PERSONALIZADOS*\n\n${lista}`,
      m
    )
  }

  // Configurar comando antiguo: .conftacos texto
  if (command.startsWith("conf")) {
    const nombre = command.replace(/^conf/i, "").toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, "")

    if (!db[groupId] || !db[groupId][nombre]) {
      return conn.reply(m.chat, "> ⚠️ Este comando no existe, usa .crearconf primero.", m)
    }

    if (!isOwner && !isAdmin) {
      return conn.reply(m.chat, "> 🚫 Solo admins u owners pueden configurar este comando.", m)
    }

    let texto = text && text.trim() ? text.trim() : null
    const imageMessage = m.message?.imageMessage || null
    const quotedImageMessage = getQuotedImageMessage(m)
    const quotedText = !texto ? getQuotedText(m) : null

    if (!texto && quotedText) texto = quotedText

    if (!texto && !imageMessage && !quotedImageMessage) {
      return conn.reply(
        m.chat,
        `⚠️ Debes configurar este comando correctamente.\n\n` +
        `> Usa: .conf${nombre} <texto>\n` +
        `> O responde a una imagen/texto con: .conf${nombre}\n` +
        `> Luego actívalo con: .${nombre}`,
        m
      )
    }

    await saveConfig(nombre, groupId, texto, imageMessage, quotedImageMessage)

    return conn.reply(m.chat, "✅ Texto/imagen configurado correctamente.", m)
  }

  // Responder comandos personalizados
  const nombre = command.toLowerCase()

  if (db[groupId] && db[groupId][nombre]) {
    const value = db[groupId][nombre].value

    if (!value || (!value.texto && !value.media)) {
      return conn.reply(
        m.chat,
        `⚠️ Este comando aún no está configurado.\n\n` +
        `> Usa: .conf${nombre} <texto>\n` +
        `> O responde a una imagen/texto con: .conf${nombre}`,
        m
      )
    }

    let fechaFormateada = formatearFecha()

    if (value.media) {
      const buffer = fs.readFileSync(value.media)
      return conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: `${value.texto || ""}\n\n> ${groupName} ┊ ${fechaFormateada}`
        },
        { quoted: m }
      )
    }

    return conn.sendMessage(
      m.chat,
      {
        text: `${value.texto || ""}\n\n> ${groupName} ┊ ${fechaFormateada}`
      },
      { quoted: m }
    )
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatearFecha() {
  let fecha = new Date()
  let opciones = { day: "numeric", month: "long" }
  let fechaFormateada = fecha.toLocaleDateString("es-MX", opciones)
  return fechaFormateada.replace(
    /\b(de )([a-z])/,
    (match, de, letra) => de + letra.toUpperCase()
  )
}

handler.help = [
  "setNombre *<texto>*",
  "crearconf *<nombre>*",
  "delconf *<nombre>*",
  "listarconf"
]

handler.tags = ["group"]

handler.command = new RegExp(
  `^crearconf$|^delconf$|^listarconf$|^listset$|^set\\w+$|^conf\\w+$|^(?!${excluidos.join("|")}$)\\w+$`,
  "i"
)

export default handler
