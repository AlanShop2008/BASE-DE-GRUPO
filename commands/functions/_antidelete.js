import fs from 'fs'

const file = './database/antidelete.json'

if (!global.antideleteMessages) {
  global.antideleteMessages = new Map()
}

const messageCache = global.antideleteMessages

function loadDB() {
  if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true })
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2))
  }

  return JSON.parse(fs.readFileSync(file))
}

function getMessageId(m) {
  return m?.key?.id || m?.id || null
}

function getSender(m) {
  return m?.key?.participant || m?.sender || m?.participant || m?.key?.remoteJid || ''
}

function getTextFromMessage(m) {
  let msg = m.message || m.msg || {}

  if (!msg) return null

  if (msg.ephemeralMessage?.message) {
    msg = msg.ephemeralMessage.message
  }

  if (msg.viewOnceMessage?.message) {
    msg = msg.viewOnceMessage.message
  }

  if (msg.viewOnceMessageV2?.message) {
    msg = msg.viewOnceMessageV2.message
  }

  if (msg.conversation) {
    return msg.conversation
  }

  if (msg.extendedTextMessage?.text) {
    return msg.extendedTextMessage.text
  }

  if (msg.imageMessage) {
    return msg.imageMessage.caption
      ? `🖼️ Imagen con texto:\n${msg.imageMessage.caption}`
      : '🖼️ Imagen eliminada'
  }

  if (msg.videoMessage) {
    return msg.videoMessage.caption
      ? `🎥 Video con texto:\n${msg.videoMessage.caption}`
      : '🎥 Video eliminado'
  }

  if (msg.documentMessage) {
    return `📄 Documento eliminado: ${msg.documentMessage.fileName || 'sin nombre'}`
  }

  if (msg.audioMessage) {
    return '🎵 Audio eliminado'
  }

  if (msg.stickerMessage) {
    return '🧩 Sticker eliminado'
  }

  if (msg.contactMessage) {
    return '👤 Contacto eliminado'
  }

  if (msg.locationMessage) {
    return '📍 Ubicación eliminada'
  }

  if (msg.buttonsResponseMessage?.selectedDisplayText) {
    return msg.buttonsResponseMessage.selectedDisplayText
  }

  if (msg.listResponseMessage?.title) {
    return msg.listResponseMessage.title
  }

  return null
}

function isDeleteMessage(m) {
  let msg = m.message || {}

  if (msg.protocolMessage?.type === 0) {
    return true
  }

  if (msg.protocolMessage?.type === 'REVOKE') {
    return true
  }

  return false
}

function getDeletedKey(m) {
  let msg = m.message || {}
  return msg.protocolMessage?.key || null
}

function cleanNumber(jid) {
  if (!jid) return 'desconocido'
  return jid.split('@')[0]
}

function cleanOldCache() {
  const now = Date.now()
  const maxAge = 1000 * 60 * 60 * 6

  for (let [id, data] of messageCache.entries()) {
    if (now - data.time > maxAge) {
      messageCache.delete(id)
    }
  }
}

export async function before(m, { conn }) {
  try {
    if (!m.isGroup) return false

    let db = loadDB()

    if (!db.includes(m.chat)) return false

    cleanOldCache()

    // Detectar mensaje eliminado
    if (isDeleteMessage(m)) {
      let deletedKey = getDeletedKey(m)
      if (!deletedKey) return false

      let deletedId = deletedKey.id
      let deletedChat = deletedKey.remoteJid || m.chat
      let cacheKey = `${deletedChat}:${deletedId}`

      let saved = messageCache.get(cacheKey)

      if (!saved) {
        return false
      }

      let autor = saved.sender || deletedKey.participant || ''
      let numero = cleanNumber(autor)
      let texto = saved.text || 'No pude recuperar el contenido del mensaje.'

      let mensaje =
`🚨 *MENSAJE ELIMINADO*

👤 *De:* @${numero}
📱 *Número:* ${numero}

💬 *Mensaje eliminado:*
${texto}`

      await conn.sendMessage(
        deletedChat,
        {
          text: mensaje,
          mentions: [autor]
        },
        {
          quoted: m
        }
      )

      messageCache.delete(cacheKey)
      return false
    }

    // Guardar mensajes normales mientras antidelete esté activo
    let id = getMessageId(m)
    if (!id) return false

    let text = getTextFromMessage(m)
    if (!text) return false

    let sender = getSender(m)
    let cacheKey = `${m.chat}:${id}`

    messageCache.set(cacheKey, {
      chat: m.chat,
      sender,
      text,
      time: Date.now()
    })

    return false
  } catch (e) {
    console.error('[ANTIDELETE ERROR]', e)
    return false
  }
}
