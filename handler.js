import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
const { proto } = (await import('@whiskeysockets/baileys')).default
import fs from 'fs'
import ws from 'ws'
import chalk from 'chalk'

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
  clearTimeout(this)
  resolve()
}, ms))

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  if (!chatUpdate) return
  this.pushMessage(chatUpdate.messages).catch(console.error)

  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return
  if (global.db.data == null) await global.loadDatabase()

  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = 0

    let isBotPrem = false
    if (!isBotPrem) {
      try {
        const botJid = this.user.jid.split('@')[0]
        const premiumFilePath = path.join(`./${global.jadi}`, botJid, 'premium.json')
        if (fs.existsSync(premiumFilePath)) {
          const premiumConfig = JSON.parse(fs.readFileSync(premiumFilePath, 'utf8'))
          isBotPrem = premiumConfig.premiumBot === true
        }
      } catch (e) {
        console.error('Error al verificar el estado premium del bot:', e)
      }
    }

    try {
      global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
      let user = global.db.data.users[m.sender]

      if (typeof user !== 'object') {
        user = global.db.data.users[m.sender] = {
          exp: 0,
          coin: 50,
          lastmiming: 0,
          lastclaim: 0,
          registered: false,
          name: m.name,
          age: -1,
          regTime: -1,
          afk: -1,
          afkReason: '',
          banned: false,
          warn: 0,
          level: 0,
          role: 'Novato',
          autolevelup: false,
          chatbot: false,
        }
      }

      let chat = global.db.data.chats[m.chat]
      if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}

      if (chat) {
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('welcome' in chat)) chat.welcome = true
        if (!('detect' in chat)) chat.detect = false
        if (!('sWelcome' in chat)) chat.sWelcome = ''
        if (!('sBye' in chat)) chat.sBye = ''
        if (!('sPromote' in chat)) chat.sPromote = ''
        if (!('sDemote' in chat)) chat.sDemote = ''
        if (!('antiLink' in chat)) chat.antiLink = true
        if (!('viewonce' in chat)) chat.viewonce = false
        if (!('autoresponder' in chat)) chat.autoresponder = false
        if (!('onlyLatinos' in chat)) chat.onlyLatinos = false
        if (!('nsfw' in chat)) chat.nsfw = false
        if (!('antiLag' in chat)) chat.antiLag = false
        if (!('allantilink' in chat)) chat.allantilink = true
        if (!('per' in chat)) chat.per = []
        if (!('botOff' in chat)) chat.botOff = false
        if (!('modoOwner' in chat)) chat.modoOwner = false
        if (!isNumber(chat.expired)) chat.expired = 0
      } else {
        global.db.data.chats[m.chat] = {
          isBanned: false,
          botOff: false,
          modoOwner: false,
          antiLag: false,
          per: [],
          welcome: true,
          detect: false,
          sWelcome: '',
          sBye: '',
          sPromote: '',
          sDemote: '',
          autoresponder: false,
          antiLink: true,
          viewonce: false,
          useDocument: true,
          onlyLatinos: false,
          nsfw: false,
          allantilink: true,
          expired: 0,
        }
      }

      let settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}

      if (settings) {
        if (!('self' in settings)) settings.self = false
        if (!('autoread' in settings)) settings.autoread = false
        if (!('restrict' in settings)) settings.restrict = true
        if (!('actives' in settings)) settings.actives = []
        if (!('status' in settings)) settings.status = 0
        if (!('noprefix' in settings)) settings.noprefix = false
        if (!('logo' in settings)) settings.logo = null
      } else {
        global.db.data.settings[this.user.jid] = {
          self: false,
          autoread: false,
          restrict: true,
          actives: [],
          status: 0,
          noprefix: false,
          logo: '',
        }
      }
    } catch (e) {
      console.error(e)
    }

    const mainBot = global.conn.user.jid ? global.conn.user.jid : global.conn.user.id
    const chat = global.db.data.chats[m.chat] || {}
    const isSubbs = chat.antiLag === true
    const allowedBots = chat.per || []

    if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)

    const isAllowed = allowedBots.includes(this.user.jid)

    if (isSubbs && !isAllowed) return
    if (opts['nyimak']) return
    if (m.isBaileys && !m.fromMe) return
    if (!m.fromMe && opts['self']) return
    if (opts['pconly'] && m.chat.endsWith('g.us')) return
    if (opts['gconly'] && !m.chat.endsWith('g.us')) return
    if (opts['swonly'] && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string') m.text = ''

    const sendNum = m.sender.replace(/[^0-9]/g, '')

    const isROwner = [
      conn.decodeJid(global.conn.user.jid),
      ...global.owner.map(([number]) => number)
    ]
      .map(v => v.replace(/[^0-9]/g, ''))
      .includes(sendNum)

    const isSubBot = [
      conn.user.jid,
      ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)
    ].includes(m.sender || sendNum)

    const isPremSubs = global.db.data.users[m.sender]?.token === true && global.conns
      .map(c => conn.decodeJid(c.user?.id || ''))
      .map(v => v.replace(/[^0-9]/g, ''))
      .includes((sendNum || m.sender || '').replace(/[^0-9]/g, ''))

    const isOwner = isROwner
    const modList = global.mods.map(v => v.replace(/[^0-9]/g, ''))
    const isMod = modList.includes(sendNum)
    const isMods = isOwner || isROwner || isMod
    const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

    // ============================================================
    // MODO OWNER POR GRUPO
    // Si está activo, solo el owner puede usar el bot en ese grupo.
    // Los demás reciben aviso y el comando no se ejecuta.
    // ============================================================
    if (m.isGroup && global.db.data.chats[m.chat]?.modoOwner === true && !isROwner) {
      const texto = (m.text || '').trim()

      if (
        texto.startsWith('.') ||
        texto.startsWith('/') ||
        texto.startsWith('#') ||
        texto.startsWith('!')
      ) {
        await this.reply(
          m.chat,
          '⛔ Bot desactivado.\nPara más información contacta a mi creador.',
          m
        )
      }

      return
    }

    // ============================================================
    // BLOQUEO REAL DE GRUPOS DESACTIVADOS
    // ============================================================
    const comandoGrupoOff = (m.text || '')
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/^[./#!?]+/, '')

    const comandosPermitidosGrupoOff = [
      'activarid',
      'desactivarid',
      'modoowner',
      'grupos',
      'listagrupos'
    ]

    if (
      m.isGroup &&
      global.db.data.chats[m.chat]?.botOff === true &&
      !isROwner &&
      !comandosPermitidosGrupoOff.includes(comandoGrupoOff)
    ) {
      console.log(`[BOT OFF] Mensaje bloqueado en ${m.chat}: ${m.text}`)
      return
    }

    if (opts['queque'] && m.text && !(isMods || isPrems)) {
      let queque = this.msgqueque, time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        await delay(time)
      }, time)
    }

    if (m.isBaileys) return

    m.exp += Math.ceil(Math.random() * 10)

    let usedPrefix
    let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

    async function getLidFromJid(id, conn) {
      if (id.endsWith('@lid')) return id
      const res = await conn.onWhatsApp(id).catch(() => [])
      return res[0]?.lid || id
    }

    const senderLid = await getLidFromJid(m.sender, conn)
    const botLid = await getLidFromJid(conn.user.jid, conn)
    const senderJid = m.sender
    const botJid = conn.user.jid
    const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
    const participants = m.isGroup ? (groupMetadata.participants || []) : []
    const user = participants.find(p => p.id === senderLid || p.phoneNumber === senderJid) || {}
    const isRAdmin = user?.admin === 'superadmin' || user?.admin === 'admin'
    const isAdmin = isRAdmin || user?.admin === 'admin'
    const bot = participants.find(p => p.id === botLid || p.phoneNumber === botJid) || {}
    const isBotAdmin = !!bot?.admin

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './commands')

    for (let name in global.plugins) {
      let plugin = global.plugins[name]
      if (!plugin) continue
      if (plugin.disabled) continue

      const __filename = join(___dirname, name)

      if (typeof plugin.all === 'function') {
        try {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename
          })
        } catch (e) {
          console.error(e)
        }
      }

      if (!opts['restrict'])
        if (plugin.tags && plugin.tags.includes('admin')) continue

      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

      let _prefix = plugin.customPrefix
        ? plugin.customPrefix
        : global.db.data.settings[this?.user?.jid].noprefix
          ? ''
          : conn.prefix
            ? conn.prefix
            : global.prefix

      let match = (_prefix instanceof RegExp
        ? [[_prefix.exec(m.text), _prefix]]
        : Array.isArray(_prefix)
          ? _prefix.map(p => {
            let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
            return [re.exec(m.text), re]
          })
          : typeof _prefix === 'string'
            ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
            : [[[], new RegExp]]
      ).find(p => p[1])

      if (typeof plugin.before === 'function') {
        if (await plugin.before.call(this, m, {
          match,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename
        })) continue
      }

      if (typeof plugin !== 'function') continue

      if ((usedPrefix = (match && match[0]) || (global.db.data.settings[this.user.jid].noprefix && ''))) {
        let noPrefix = m.text.replace(usedPrefix, '')
        let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
        args = args || []
        let _args = noPrefix.trim().split` `.slice(1)
        let text = _args.join` `
        command = (command || '').toLowerCase()
        let fail = plugin.fail || global.dfail

        let isAccept = plugin.command instanceof RegExp
          ? plugin.command.test(command)
          : Array.isArray(plugin.command)
            ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command)
            : typeof plugin.command === 'string'
              ? plugin.command === command
              : false

        if (!isAccept) continue

        m.plugin = name

        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          let chat = global.db.data.chats[m.chat]
          let user = global.db.data.users[m.sender]
          m.handler = name

          if (name != 'owner-unbanchat.js' && chat?.isBanned && !plugin.allowBanned) return
          if (name != 'owner-unbanuser.js' && user?.banned) return
        }

        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fail('owner', m, this)
          continue
        }

        if (plugin.rowner && !isROwner) {
          fail('rowner', m, this)
          continue
        }

        if (plugin.owner && !isOwner) {
          fail('owner', m, this)
          continue
        }

        if (plugin.botprem && !isBotPrem) {
          fail('botprem', m, this, usedPrefix, command)
          continue
        }

        if (plugin.mods && !isMods) {
          fail('mods', m, this)
          continue
        }

        if (plugin.premium && !isPrems) {
          fail('premium', m, this)
          continue
        }

        if (plugin.group && !m.isGroup) {
          fail('group', m, this)
          continue
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail('botAdmin', m, this)
          continue
        } else if (plugin.admin && !isAdmin) {
          fail('admin', m, this)
          continue
        }

        if (plugin.private && m.isGroup) {
          fail('private', m, this)
          continue
        }

        if (plugin.register == true && _user.registered == false) {
          fail('unreg', m, this)
          continue
        }

        m.isCommand = true

        let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17

        if (xp > 200) m.reply('chirrido -_-')
        else m.exp += xp

        let extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isBotPrem,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename
        }

        try {
          await plugin.call(this, m, extra)
        } catch (e) {
          m.error = e
          console.error(e)

          if (e) {
            let text = format(e)
            for (let key of Object.values(global.APIKeys || {})) {
              text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
            }
          }

          if (e?.name) {
            console.error('Plugin error:', e.name)
          }
        } finally {
          if (typeof plugin.after === 'function') {
            try {
              await plugin.after.call(this, m, extra)
            } catch (e) {
              console.error(e)
            }
          }
        }

        break
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    if (opts['queque'] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1)
        this.msgqueque.splice(quequeIndex, 1)
    }

    let user, stats = global.db.data.stats

    if (m) {
      if (m.sender && (user = global.db.data.users[m.sender])) {
        user.exp += m.exp
      }

      let stat
      if (m.plugin) {
        let now = +new Date

        if (m.plugin in stats) {
          stat = stats[m.plugin]
          if (!isNumber(stat.total)) stat.total = 1
          if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
          if (!isNumber(stat.last)) stat.last = now
          if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
        } else {
          stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
        }

        stat.total += 1
        stat.last = now

        if (m.error == null) {
          stat.success += 1
          stat.lastSuccess = now
        }
      }
    }

    try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
  }
}