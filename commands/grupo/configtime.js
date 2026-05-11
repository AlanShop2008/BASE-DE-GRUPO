import fs from "fs"
import moment from "moment-timezone"

const TIMERS_FILE = "./groupTimers.json"
global.groupTimers = global.groupTimers || {}

if (fs.existsSync(TIMERS_FILE)) {
  let saved = JSON.parse(fs.readFileSync(TIMERS_FILE))
  for (let chat in saved) {
    let { action, time } = saved[chat]
    programarChequeo(chat, action, time)
  }
}

function guardarTimers() {
  let data = {}
  for (let chat in global.groupTimers) {
    data[chat] = global.groupTimers[chat].info
  }
  fs.writeFileSync(TIMERS_FILE, JSON.stringify(data, null, 2))
}

async function crearFgrupo(conn, chat) {
  let groupName = await conn.getName(chat)
  let ppUrl
  try {
    ppUrl = await conn.profilePictureUrl(chat, 'image')
  } catch {
    ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png'
  }

  return {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      id: "Undefined"
    },
    message: {
      locationMessage: {
        name: groupName,
        jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
      }
    }
  }
}

async function ejecutarAccion(chat, action) {
  const fgrupo = await crearFgrupo(conn, chat)

  if (action === "cerrar") {
    await conn.groupSettingUpdate(chat, "announcement")
    conn.sendMessage(chat, { text: `🔒 Grupo cerrado automáticamente.` }, { quoted: fgrupo })
  } else {
    await conn.groupSettingUpdate(chat, "not_announcement")
    conn.sendMessage(chat, { text: `🔓 Grupo abierto automáticamente.` }, { quoted: fgrupo })
  }
}

function programarChequeo(chat, action, timeISO) {
  if (global.groupTimers[chat]) {
    clearTimeout(global.groupTimers[chat].timeout)
    clearInterval(global.groupTimers[chat].interval)
  }

  let target = moment(timeISO).tz("America/Mexico_City")
  let now = moment().tz("America/Mexico_City")
  let delay = target.diff(now)

  if (delay <= 0) delay = 1000

  let timeout = setTimeout(async () => {
    clearInterval(interval)
    delete global.groupTimers[chat]
    await ejecutarAccion(chat, action)
    guardarTimers()
  }, delay)

  let interval = setInterval(async () => {
    let nowCheck = moment().tz("America/Mexico_City")
    if (nowCheck.isSameOrAfter(target)) {
      clearInterval(interval)
      clearTimeout(timeout)
      delete global.groupTimers[chat]
      await ejecutarAccion(chat, action)
      guardarTimers()
    }
  }, 1000)

  global.groupTimers[chat] = {
    timeout,
    interval,
    info: { action, time: target.toISOString() }
  }
  guardarTimers()
}

let handler = async (m, { conn, args, command }) => {
  const chat = m.chat
  if (!m.isGroup) return m.reply("⚠️ *Este comando solo puede usarse en grupos.*")

  const groupMetadata = await conn.groupMetadata(chat)
  const groupName = groupMetadata.subject || "Grupo"
  let action = command.toLowerCase()

  if (!args[0]) {
    await ejecutarAccion(chat, action)
    const fgrupo = await crearFgrupo(conn, chat)
    return conn.sendMessage(chat, { 
      text: `✅ Acción ejecutada inmediatamente\n` +
            `✦ Acción: ${action === "cerrar" ? "🔒 Cerrar grupo" : "🔓 Abrir grupo"}\n` +
            `✦ Grupo: ${groupName}`
    }, { quoted: fgrupo })
  }

  let now = moment().tz("America/Mexico_City")
  let target = null

  if (args[0].includes(":")) {
    let timeStr = args[0]
    let suffix = args[1] ? args[1].toLowerCase() : ""
    let [hourStr, minStr] = timeStr.split(":")
    let hour = parseInt(hourStr)
    let minute = parseInt(minStr)

    if (suffix.includes("pm") && hour < 12) hour += 12
    if (suffix.includes("am") && hour === 12) hour = 0

    target = moment(now.format("YYYY-MM-DD"), "YYYY-MM-DD").tz("America/Mexico_City")
      .hour(hour).minute(minute).second(0)

    if (target.isSameOrBefore(now)) target.add(1, "day")

    target.subtract(3, "minutes")

    programarChequeo(chat, action, target.toISOString())

    const fgrupo = await crearFgrupo(conn, chat)
    return conn.sendMessage(chat, { 
      text: `🕰️ *Temporizador establecido*\n` +
            `✦ Acción: ${action === "cerrar" ? "🔒 Cerrar grupo" : "🔓 Abrir grupo"}\n` +
            `✦ Grupo: ${groupName}\n` +
            `✦ Ejecución: ${target.add(3, "minutes").format("D [de] MMMM, h:mm:ss a")}\n\n` +
            `📌 Para cancelar este temporizador, establece otra hora con el mismo comando.`
    }, { quoted: fgrupo })
  }

  else {
    let match = args[0].match(/^(\d+)(s|m|h)$/i)
    if (!match) return m.reply("⚠️ Formato inválido. Usa ej: `10m`, `30s`, `2h` o `10:30 pm`")
    let value = parseInt(match[1])
    let unit = match[2].toLowerCase()

    target = now.clone()
    if (unit === "s") target.add(value, "seconds")
    if (unit === "m") target.add(value, "minutes")
    if (unit === "h") target.add(value, "hours")

    programarChequeo(chat, action, target.toISOString())

    let mensajeTarget = target.clone().add(3, "minutes")
    const fgrupo = await crearFgrupo(conn, chat)

    return conn.sendMessage(chat, { 
      text: `🕰️ *Temporizador establecido*\n` +
            `✦ Acción: ${action === "cerrar" ? "🔒 Cerrar grupo" : "🔓 Abrir grupo"}\n` +
            `✦ Grupo: ${groupName}\n` +
            `✦ Ejecución: ${mensajeTarget.format("D [de] MMMM, h:mm:ss a")}\n\n` +
            `📌 Para cancelar este temporizador, establece otra hora con el mismo comando.`
    }, { quoted: fgrupo })
  }
}

handler.help = ["cerrar [hora|duración]", "abrir [hora|duración]"]
handler.tags = ["grupo"]
handler.command = /^(cerrar|abrir)$/i
handler.group = true
handler.admin = true

export default handler
