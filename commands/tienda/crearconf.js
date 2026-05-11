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
  "crearconf","delconf","eliminarconf","eliminarset","listarconf",
  "robux","ado","alimentos","antecedentes","baz","boletos","canva","citas","codigo",
  "combos","combos2","combos3","actas","adicionales","certificados","diamantes","documentos",
  "gamepass","garantias","instalacion","justificantes2","libros","pago2","pago3","peliculas",
  "seguidores","tramites","juegos","imss","justificantes","orden","pago","permisos","programas",
  "promo","recargas","reembolsos","reportes","rfc","santander","sat","seguro","semanas",
  "stock","vigencia","youtube","robux","setado","setalimentos","setantecedentes","setbaz","setboletos","setcanva","setcitas","setcodigo",
  "setcombos","setcombos2","setcombos3","setactas","setadicionales","setcertificados","setdiamantes","setdocumentos",
  "setgamepass","setgarantias","setinstalacion","setjustificantes2","setlibros","setpago2","setpago3","setpeliculas",
  "setseguidores","settramites","setjuegos","setimss","setjustificantes","setorden","setpago","setpermisos","setprogramas",
  "setpromo","setrecargas","setreembolsos","setreportes","setrfc","setsantander","setsat","setseguro","setsemanas",
  "setstock","setvigencia","setyoutube"
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

async function saveConfig(nombre, groupId, texto, imageMessage, quotedImageMessage) {
  let mediaPath = null

  if (imageMessage) {
    const stream = await downloadContentFromMessage(imageMessage, "image")
    let buffer = Buffer.alloc(0)
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    mediaPath = path.join(__dirname, `conf_${nombre}.jpg`)
    fs.writeFileSync(mediaPath, buffer)
  }

  if (quotedImageMessage) {
    const stream = await downloadContentFromMessage(quotedImageMessage, "image")
    let buffer = Buffer.alloc(0)
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    mediaPath = path.join(__dirname, `conf_${nombre}.jpg`)
    fs.writeFileSync(mediaPath, buffer)
  }

  db[groupId][nombre].value = {}
  if (texto) db[groupId][nombre].value.texto = texto
  if (mediaPath) db[groupId][nombre].value.media = mediaPath

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

async function handler(m, { conn, command, text }) {
  const groupId = m.chat
  let groupName = ""
  try {
    const meta = await conn.groupMetadata(m.chat)
    groupName = meta.subject || ""
  } catch (e) {
    groupName = ""
  }

  if (command === "crearconf") {
    const senderNum = DIGITS(m.sender || "")
    const owners = Array.isArray(global.owner) ? global.owner : []
    const isOwner = owners.some(([id]) => id === senderNum)

    if (!isOwner) {
      return conn.reply(m.chat, "> 🚫 SOLO EL CREADOR PUEDE USAR ESTE COMANDO", m)
    }

    const nombre = text.trim().toLowerCase()
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

  if (command === "delconf") {
    const senderNum = DIGITS(m.sender || "")
    const owners = Array.isArray(global.owner) ? global.owner : []
    const isOwner = owners.some(([id]) => id === senderNum)

    if (!isOwner) {
      return conn.reply(m.chat, "> 🚫 SOLO EL CREADOR PUEDE USAR ESTE COMANDO", m)
    }

    const nombre = text.trim().toLowerCase()
    if (!nombre) return conn.reply(m.chat, "> ⚠️ DEBES INDICAR EL NOMBRE DEL COMANDO A ELIMINAR", m)

    if (!db[groupId] || !db[groupId][nombre]) {
      return conn.reply(m.chat, "> ⚠️ ESE COMANDO NO EXISTE EN ESTE GRUPO", m)
    }

    const mediaPath = db[groupId][nombre].value?.media
    if (mediaPath && fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath)
    }

    delete db[groupId][nombre]
    if (Object.keys(db[groupId]).length === 0) {
      delete db[groupId]
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

    return conn.reply(m.chat, `🗑️ EL COMANDO "${nombre}" HA SIDO ELIMINADO`, m)
  }

  if (command.startsWith("conf")) {
    const nombre = command.replace(/^conf/i, "").toLowerCase()
    if (!db[groupId] || !db[groupId][nombre]) {
      return conn.reply(m.chat, "> ⚠️ ESTE COMANDO NO EXISTE, USA .crearconf PRIMERO", m)
    }

    // 🔒 Validar permisos (solo admins u owners)
    const senderNum = DIGITS(m.sender || "")
    const owners = Array.isArray(global.owner) ? global.owner : []
    const isOwner = owners.some(([id]) => id === senderNum)

    let isAdmin = false
    try {
      const meta = await conn.groupMetadata(m.chat)
      const participant = meta.participants.find(p => p.id === m.sender)
      isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin"
    } catch (e) {
      isAdmin = false
    }

    if (!isOwner && !isAdmin) {
      return conn.reply(m.chat, "> 🚫 SOLO ADMINS U OWNERS PUEDEN CONFIGURAR ESTE COMANDO", m)
    }

    let texto = text && text.trim() ? text.trim() : null
    const imageMessage = m.message?.imageMessage || null
    const quotedImageMessage = getQuotedImageMessage(m)
    const quotedText = !texto ? getQuotedText(m) : null

    if (!texto && !imageMessage && !quotedImageMessage && !quotedText) {
      return conn.reply(
        m.chat,
        `⚠️ Debes configurar este comando correctamente\n\n` +
        `> Usa: .conf${nombre} <TEXTO>\n` +
        `> O responde a una *imagen* o *texto* con: .conf${nombre} <TEXTO>\n` +
        `> Luego actívalo con: .${nombre}`,
        m
      )
    }

    if (!texto && quotedText) texto = quotedText

    await saveConfig(nombre, groupId, texto, imageMessage, quotedImageMessage)
    return conn.reply(m.chat, "✅ TEXTO/IMAGEN CONFIGURADO CORRECTAMENTE", m)
  }

  const nombre = command.toLowerCase()
  if (db[groupId] && db[groupId][nombre]) {
    const value = db[groupId][nombre].value
    if (!value || (!value.texto && !value.media)) {
      return conn.reply(
        m.chat,
        `⚠️ ESTE COMANDO AÚN NO ESTÁ CONFIGURADO\n\n` +
        `> Usa: .conf${nombre} <TEXTO>\n` +
        `> O responde a una *imagen* o *texto* con: .conf${nombre} <TEXTO>\n` +
        `> Luego actívalo con: .${nombre}`,
        m
      )
    }

    let fechaFormateada = formatearFecha()

    if (value.media) {
      const buffer = Buffer.from(fs.readFileSync(value.media).toString("base64"), "base64")
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: `${value.texto || ""}\n\n> ${groupName} ┊ ${fechaFormateada}`
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          text: `${value.texto || ""}\n\n> ${groupName} ┊ ${fechaFormateada}`
        },
        { quoted: m }
      )
    }
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
    (match, de, letra) => de + letra.toUpperCase() + match.slice(de.length + 1)
  )
}

handler.help = ["crearconf *<nombre>*","delconf *<nombre>*","confNombre *<texto>*","nombre"]
handler.tags = ["group"]
handler.command = new RegExp(`^crearconf$|^delconf$|^conf\\w+$|^(?!${excluidos.join("|")}$)\\w+$`,"i")

export default handler
