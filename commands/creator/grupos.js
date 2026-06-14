import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const salidosPath = path.join(__dirname, 'grupos_salidos.json')

if (!fs.existsSync(salidosPath)) fs.writeFileSync(salidosPath, '[]')

let gruposCache = {}

function leerSalidos() {
  try {
    return JSON.parse(fs.readFileSync(salidosPath))
  } catch {
    return []
  }
}

function guardarSalido(jid) {
  let salidos = leerSalidos()
  if (!salidos.includes(jid)) salidos.push(jid)
  fs.writeFileSync(salidosPath, JSON.stringify(salidos, null, 2))
}

async function getGroups(conn) {
  let groups = []
  let salidos = leerSalidos()

  try {
    let data = await conn.groupFetchAllParticipating()
    groups = Object.entries(data).map(([jid, group]) => ({
      jid,
      name: group.subject || 'Sin nombre'
    }))
  } catch {
    groups = Object.entries(conn.chats || {})
      .filter(([jid]) => jid.endsWith('@g.us'))
      .map(([jid, chat]) => ({
        jid,
        name: chat.subject || chat.name || 'Sin nombre'
      }))
  }

  return groups
    .filter(g => !salidos.includes(g.jid))
    .filter(g => g.name && g.name !== 'Sin nombre')
}

const handler = async (m, { conn, command, text, isOwner, isROwner }) => {
  if (!isOwner && !isROwner) {
    return conn.reply(m.chat, '🚫 Solo el dueño del bot puede usar este comando.', m)
  }

  if (command === 'grupos') {
    let groups = await getGroups(conn)

    if (!groups.length) {
      return conn.reply(m.chat, '⚠️ El bot no está en ningún grupo.', m)
    }

    gruposCache[m.sender] = groups

    let texto = `💜 *GRUPOS DONDE ESTÁ EL BOT*\n\n`
    texto += `📌 Total: *${groups.length}*\n\n`

    texto += groups.map((g, i) => {
      return `*${i + 1}.* ${g.name}\n🆔 ${g.jid}`
    }).join('\n\n')

    texto += `\n\n📤 *Para enviar aviso a un grupo usa:*\n`
    texto += `*.enviaraviso número mensaje*\n\n`
    texto += `Ejemplo:\n`
    texto += `*.enviaraviso 1 Buenas tardes, este es un aviso importante.*\n\n`

    texto += `🚪 *Para salir de un grupo usa:*\n`
    texto += `*.exit número*\n\n`
    texto += `Ejemplo:\n`
    texto += `*.exit 1*`

    return conn.reply(m.chat, texto, m)
  }

  if (command === 'enviaraviso') {
    if (!text) {
      return conn.reply(
        m.chat,
        `⚠️ Usa el número del grupo y el mensaje.\n\n` +
        `Ejemplo:\n` +
        `*.enviaraviso 1 Buenas tardes, este es un aviso importante.*`,
        m
      )
    }

    let args = text.trim().split(' ')
    let num = parseInt(args[0])
    let aviso = args.slice(1).join(' ').trim()

    if (!num || isNaN(num)) {
      return conn.reply(
        m.chat,
        `⚠️ Debes poner el número del grupo.\n\n` +
        `Ejemplo:\n` +
        `*.enviaraviso 1 Buenas tardes grupo.*`,
        m
      )
    }

    if (!aviso) {
      return conn.reply(
        m.chat,
        `⚠️ Debes escribir el aviso después del número.\n\n` +
        `Ejemplo:\n` +
        `*.enviaraviso 1 Buenas tardes grupo.*`,
        m
      )
    }

    let groups = gruposCache[m.sender] || await getGroups(conn)
    let grupo = groups[num - 1]

    if (!grupo) {
      return conn.reply(
        m.chat,
        `❌ Ese número no existe en la lista.\n\n` +
        `Usa *.grupos* para ver la lista correcta.`,
        m
      )
    }

    try {
      await conn.sendMessage(grupo.jid, {
        text: `📢 *AVISO IMPORTANTE*\n\n${aviso}`
      })

      return conn.reply(
        m.chat,
        `✅ *Aviso enviado correctamente*\n\n` +
        `📌 Grupo: *${grupo.name}*\n` +
        `🔢 Número: *${num}*\n\n` +
        `📝 Mensaje:\n${aviso}`,
        m
      )
    } catch (e) {
      console.log(e)
      return conn.reply(
        m.chat,
        `❌ No se pudo enviar el aviso al grupo:\n\n*${grupo.name}*`,
        m
      )
    }
  }

  if (command === 'exit') {
    let num = parseInt(text)

    if (!num || isNaN(num)) {
      return conn.reply(m.chat, '⚠️ Usa el número del grupo.\n\nEjemplo: *.exit 1*', m)
    }

    let groups = gruposCache[m.sender] || await getGroups(conn)
    let grupo = groups[num - 1]

    if (!grupo) {
      return conn.reply(m.chat, '❌ Ese número no existe en la lista.', m)
    }

    await conn.reply(m.chat, `🚪 Saliendo del grupo:\n\n*${grupo.name}*`, m)

    try {
      await conn.groupLeave(grupo.jid)
    } catch (e) {
      console.log(e)
    }

    guardarSalido(grupo.jid)

    if (conn.chats?.[grupo.jid]) delete conn.chats[grupo.jid]
    if (conn.store?.chats?.delete) conn.store.chats.delete(grupo.jid)

    gruposCache[m.sender] = groups.filter(g => g.jid !== grupo.jid)

    return conn.reply(m.chat, `✅ El bot salió correctamente de:\n\n*${grupo.name}*`, m)
  }
}

handler.help = ['grupos', 'exit', 'enviaraviso']
handler.tags = ['creator']
handler.command = /^(grupos|exit|enviaraviso)$/i
handler.owner = true

export default handler