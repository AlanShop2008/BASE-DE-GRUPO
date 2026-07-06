import fs from 'fs'
import path from 'path'
import pino from 'pino'
import NodeCache from 'node-cache'
import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} from '@whiskeysockets/baileys'

import { makeWASocket } from './simple.js'

const activeSerbots = new Map()
const msgRetryCounterCache = new NodeCache()

export async function startSerbot(conn, m, number) {
  const jid = m.sender
  const cleanNumber = number.replace(/\D/g, '')
  const folder = path.join('./Jadibot', cleanNumber)

  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

  if (activeSerbots.has(cleanNumber)) {
    return conn.reply(m.chat, '⚠️ Ese número ya tiene un SERBOT activo.', m)
  }

  const { state, saveCreds } = await useMultiFileAuthState(folder)
  const { version } = await fetchLatestBaileysVersion()

  const subbot = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['ALAN SHOP SERBOT', 'Edge', '110.0.1587.56'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    version
  })

  activeSerbots.set(cleanNumber, subbot)

  subbot.ev.on('creds.update', saveCreds)

  subbot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    const reason = lastDisconnect?.error?.output?.statusCode

    if (connection === 'open') {
      await conn.reply(
        m.chat,
        `✅ *SERBOT CONECTADO*\n\n🤖 Tu número ya está activo como subbot de *ALAN SHOP*.`,
        m
      )
    }

    if (connection === 'close') {
      activeSerbots.delete(cleanNumber)

      if (reason !== DisconnectReason.loggedOut) {
        setTimeout(() => {
          startSerbot(conn, m, cleanNumber).catch(console.error)
        }, 5000)
      } else {
        await conn.reply(
          m.chat,
          `⚠️ El SERBOT cerró sesión.\n\nSi quieres volver a usarlo, escribe *.serbot*.`,
          m
        )
      }
    }
  })

  if (!subbot.authState.creds.registered) {
    setTimeout(async () => {
      try {
        let code = await subbot.requestPairingCode(cleanNumber, 'ALANSHOP')
        code = code?.match(/.{1,4}/g)?.join('-') || code

        await conn.reply(
          m.chat,
          `🤖 *ALAN SHOP - SERBOT*\n\n` +
          `Tu código de vinculación es:\n\n` +
          `🔐 *${code}*\n\n` +
          `📲 Abre WhatsApp:\n` +
          `1. Dispositivos vinculados\n` +
          `2. Vincular con número de teléfono\n` +
          `3. Escribe el código\n\n` +
          `⏳ El código expira en unos minutos.`,
          m
        )
      } catch (e) {
        console.error(e)
        activeSerbots.delete(cleanNumber)
        await conn.reply(m.chat, '❌ No pude generar el código SERBOT.', m)
      }
    }, 3000)
  }

  return subbot
}

export function getSerbots() {
  return activeSerbots
}

export async function stopSerbot(number) {
  const cleanNumber = number.replace(/\D/g, '')
  const bot = activeSerbots.get(cleanNumber)

  if (!bot) return false

  try {
    bot.ev.removeAllListeners()
    bot.ws.close()
  } catch {}

  activeSerbots.delete(cleanNumber)
  return true
}
