import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
importar fs desde 'fs'

const isNumber = x => typeof x === 'number' && !isNaN(x)

const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

const cleanNumber = v => String(v || '').replace(/[^0-9]/g, '')

const isCommandText = texto => {
  texto = (texto || '').recortar()
  return text.startsWith('.') || text.startsWith('/') || text.startsWith('#') || text.startsWith('!')
}

const getCommandName = texto => {
  devolver (texto || '')
    .recortar()
    .split(/\s+/)[0]
    .toLowerCase()
    .reemplazar(/^[./#!?]+/, '')
}

función obtenerNúmerosDePropietario() {
  devolver (global.owner || [])
    .map(([número]) => cleanNumber(número))
    .filter(Booleano)
}

función ensureChatDefaults(chat) {
  Si (!('isBanned' en el chat)) chat.isBanned = false
  Si (!('bienvenido' en el chat)) chat.bienvenido = verdadero
  Si (!('detect' en el chat)) chat.detect = falso
  if (!('sWelcome' in chat)) chat.sWelcome = ''
  if (!('sBye' in chat)) chat.sBye = ''
  if (!('sPromote' in chat)) chat.sPromote = ''
  Si (!('sDemote' en el chat)) chat.sDemote = ''
  Si (!('antiLink' en el chat)) chat.antiLink = true
  Si (!('viewonce' en chat)) chat.viewonce = false
  Si (!('autoresponder' en chat)) chat.autoresponder = false
  Si (!('onlyLatinos' en el chat)) chat.onlyLatinos = false
  Si (!('nsfw' en el chat)) chat.nsfw = falso
  Si (!('antiLag' en el chat)) chat.antiLag = falso
  Si (!('allantilink' en chat)) chat.allantilink = true
  Si (!('per' en chat)) chat.per = []
  Si (!('botOff' en el chat)) chat.botOff = false
  Si (!('modoOwner' en chat)) chat.modoOwner = false
  Si (!isNumber(chat.expired)) chat.expired = 0
}

función ensureUserDefaults(usuario, m) {
  Si (!('exp' en usuario)) usuario.exp = 0
  Si (!('moneda' en usuario)) usuario.moneda = 50
  Si (!('lastmiming' en usuario)) usuario.lastmiming = 0
  Si (!('lastclaim' en usuario)) usuario.lastclaim = 0
  Si (!('registered' en usuario)) usuario.registered = falso
  Si (!('nombre' en usuario)) usuario.nombre = m.nombre
  Si (!('edad' en usuario)) usuario.edad = -1
  Si (!('regTime' en usuario)) usuario.regTime = -1
  Si (!('afk' en usuario)) usuario.afk = -1
  if (!('afkReason' in user)) user.afkReason = ''
  Si (!('banned' en usuario)) usuario.banned = falso
  Si (!('advertencia' en usuario)) usuario.advertencia = 0
  Si (!('nivel' en usuario)) usuario.nivel = 0
  Si (!('role' in user)) user.role = 'Novato'
  if (!('autolevelup' en usuario)) usuario.autolevelup = false
  Si (!('chatbot' en usuario)) usuario.chatbot = falso
}

función ensureSettingsDefaults(settings) {
  Si (!('self' en settings)) settings.self = false
  Si (!('autoread' en settings)) settings.autoread = false
  Si (!('restrict' en settings)) settings.restrict = true
  if (!('actives' in settings)) settings.actives = []
  Si (!('estado' en configuración)) configuración.estado = 0
  Si (!('noprefix' en settings)) settings.noprefix = false
  Si (!('logo' en settings)) settings.logo = null
}

función asíncrona getLidFromJid(id, conn) {
  si (!id) devolver id
  Si (id.endsWith('@lid')) devuelve id
  const res = await conn.onWhatsApp(id).catch(() => [])
  devolver res?.[0]?.lid || id
}

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []

  si (!chatUpdate) devolver
  si (!chatUpdate.messages || !chatUpdate.messages.length) devolver

  this.pushMessage(chatUpdate.messages).catch(console.error)

  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  si (!m) devolver

  if (global.db?.data == null) await global.loadDatabase()

  intentar {
    m = smsg(esto, m) || m
    si (!m) devolver

    m.exp = 0

    global.db.data.users = global.db.data.users || {}
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.settings = global.db.data.settings || {}
    global.db.data.stats = global.db.data.stats || {}

    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
    global.db.data.settings[this.user.jid] = global.db.data.settings[this.user.jid] || {}

    ensureUserDefaults(global.db.data.users[m.sender], m)
    ensureChatDefaults(global.db.data.chats[m.chat])
    ensureSettingsDefaults(global.db.data.settings[this.user.jid])

    let isBotPrem = false
    intentar {
      const botJid = this.user.jid.split('@')[0]
      const premiumFilePath = path.join(`./${global.jadi}`, botJid, 'premium.json')
      si (fs.existsSync(premiumFilePath)) {
        const premiumConfig = JSON.parse(fs.readFileSync(premiumFilePath, 'utf8'))
        isBotPrem = premiumConfig.premiumBot === true
      }
    } capturar (e) {
      console.error('Error al verificar premiumBot:', e)
    }

    const mainBot = global.conn?.user?.jid || global.conn?.user?.id || this.user.jid
    const chat = global.db.data.chats[m.chat] || {}
    const allowedBots = chat.per || []

    Si (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)

    const isSubbs = chat.antiLag === true
    const isAllowed = allowedBots.includes(this.user.jid)

    si (isSubbs && !isAllowed) devolver
    si (opts?.['nyimak']) devolver
    si (m.isBaileys && !m.fromMe) devolver
    si (!m.fromMe && opts?.['self']) devolver
    si (opts?.['pconly'] && m.chat.endsWith('g.us')) regresar
    si (opts?.['gconly'] && !m.chat.endsWith('g.us')) regresar
    si (opts?.['swonly'] && m.chat !== 'status@broadcast') regresar

    if (typeof m.text !== 'string') m.text = ''

    const sendNum = cleanNumber(m.sender)
    const botNum = cleanNumber(this.decodeJid ? this.decodeJid(this.user.jid) : this.user.jid)
    const ownerNums = getOwnerNumbers()

    const esROwner = propietarioNums.includes(enviarNum) || enviarNum === botNum
    const isOwner = isROwner

    const modList = (global.mods || []).map(v => cleanNumber(v))
    const isMod = modList.includes(sendNum)
    const isMods = isOwner || isROwner || isMod

    const isPrems = isROwner || (prems.global || [])
      .map(v => cleanNumber(v))
      .incluye(sendNum)

    const isSubBot = [
      este.usuario.jid,
      ...(global.owner || []).map(([number]) => `${cleanNumber(number)}@s.whatsapp.net`)
    ].incluye(m.sender)

    const isPremSubs = global.db.data.users[m.sender]?.token === true && Array.isArray(global.conns) && global.conns
      .map(c => this.decodeJid ? this.decodeJid(c.user?.id || '') : c.user?.id || '')
      .map(v => cleanNumber(v))
      .incluye(sendNum)

    // ============================================================
    // MODO OWNER POR GRUPO
    // Activado con .modoowner ID
    // En ese grupo solo el propietario puede usar comandos.
    // ============================================================
    if (m.isGroup && global.db.data.chats[m.chat]?.modoOwner === true && !isROwner) {
      Si (isCommandText(m.text)) {
        esperar esta respuesta(
          m.chat,
          'â›” Bot desactivado.\nPara más información contacta a mi creador.',
          metro
        )
      }
      devolver
    }

    // ============================================================
    // BOT OFF POR GRUPO
    // ============================================================
    const comandoGrupoOff = getCommandName(m.text)
    const comandosPermitidosGrupoOff = [
      'activarid',
      'desactivar',
      'modoowner',
      'grupos',
      'listagrupos'
    ]

    si (
      m.isGroup &&
      global.db.data.chats[m.chat]?.botOff === true &&
      !isROwner &&
      !comandosPermitidosGrupoOff.includes(comandoGrupoOff)
    ) {
      devolver
    }

    si (opts?.['queque'] && m.text && !(isMods || isPrems)) {
      let queque = this.msgqueque
      sea tiempo = 1000 * 5
      const previousID = queque[queque.length - 1]
      cola.push(m.id || m.key.id)

      setInterval(función asíncrona () {
        Si (queque.indexOf(previousID) === -1) clearInterval(this)
        esperar retraso(tiempo)
      }, tiempo)
    }

    si (m.isBaileys) devolver

    m.exp += Math.ceil(Math.random() * 10)

    dejar prefijo usado
    let _user = global.db.data.users[m.sender]

    const senderLid = await getLidFromJid(m.sender, this)
    const botLid = await getLidFromJid(this.user.jid, this)
    const senderJid = m.sender
    const botJid = this.user.jid

    const groupMetadata = m.isGroup
      ? ((this.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null))
      : {}

    const participantes = m.isGroup ? (groupMetadata?.participantes || []) : []

    const usuario = participantes.find(p =>
      p.id === remitente ||
      p.id === senderJid ||
      p.jid === remitenteJid ||
      p.phoneNumber === remitenteJid
    ) || {}

    const isRAdmin = user?.admin === 'superadmin' || user?.admin === 'admin'
    const isAdmin = isRAdmin || user?.admin === 'admin'

    const bot = participantes.find(p =>
      p.id === botLid ||
      p.id === botJid ||
      p.jid === botJid ||
      p.phoneNumber === botJid
    ) || {}

    const isBotAdmin = !!bot?.admin

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './commands')

    para (let nombre en global.plugins) {
      let plugin = global.plugins[name]
      si (!plugin) continuar
      si (plugin.disabled) continuar

      const __filename = join(___dirname, name)

      si (typeof plugin.all === 'function') {
        intentar {
          esperar plugin.all.call(this, m, {
            Actualización de chat,
            __dirname: ___dirname,
            __Nombre del archivo
          })
        } capturar (e) {
          console.error(e)
        }
      }

      si (!opts?.['restrict']) {
        Si (plugin.tags && plugin.tags.includes('admin')) continuar
      }

      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

      let _prefix = plugin.customPrefix
        ¿plugin.customPrefix
        : global.db.data.settings[this.user.jid].noprefix
          ¿''
          : este.prefijo
            ¿este.prefijo?
            : global.prefix

      sea coincidencia = (_prefix instancia de RegExp
        ? [[_prefix.exec(m.text), _prefix]]
        : Array.isArray(_prefix)
          ? _prefix.map(p => {
            let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
            devolver [re.exec(m.text), re]
          })
          : typeof _prefix === 'string'
            ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
            : [[[], nueva RegExp]]
      ).find(p => p[1])

      si (typeof plugin.before === 'function') {
        intentar {
          si (esperar plugin.before.call(this, m, {
            fósforo,
            conn: esto,
            participantes,
            metadatos de grupo,
            usuario,
            bot,
            esPropietario,
            esPropietario,
            esRAdmin,
            esAdministrador,
            esBotAdmin,
            esPrems,
            isBotPrem,
            Actualización de chat,
            __dirname: ___dirname,
            __Nombre del archivo
          })) continuar
        } capturar (e) {
          console.error(e)
        }
      }

      si (typeof plugin !== 'function') continuar

      si ((usedPrefix = (match && match[0]) || (global.db.data.settings[this.user.jid].noprefix && ''))) {
        let noPrefix = m.text.replace(usedPrefix, '')
        let [comando, ...args] = noPrefix.trim().split` `.filter(v => v)
        args = args || []
        let _args = noPrefix.trim().split` `.slice(1)
        `let text = _args.join`
        comando = (comando || '').toLowerCase()

        let fail = plugin.fail || global.dfail

        let isAccept = plugin.command instanceof RegExp
          ¿plugin.command.test(command)
          : Array.isArray(plugin.command)
            ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command)
            : typeof plugin.command === 'string'
              ¿comando del plugin === comando?
              : FALSO

        si (!isAccept) continuar

        m.plugin = nombre
        m.handler = nombre

        let chat = global.db.data.chats[m.chat]
        let userData = global.db.data.users[m.sender]

        si (nombre !== 'owner-unbanchat.js' && chat?.isBanned && !plugin.allowBanned) devolver
        si (nombre !== 'owner-unbanuser.js' && userData?.banned) devolver

        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fallar('propietario', m, esto)
          continuar
        }

        si (plugin.rowner && !isROwner) {
          fallar('rowner', m, esto)
          continuar
        }

        si (plugin.owner && !isOwner) {
          fallar('propietario', m, esto)
          continuar
        }

        si (plugin.botprem && !isBotPrem) {
          fallar('botprem', m, esto, prefijo usado, comando)
          continuar
        }

        si (plugin.mods && !isMods) {
          fallar('mods', m, esto)
          continuar
        }

        si (plugin.premium && !isPrems) {
          fallar('premium', m, esto)
          continuar
        }

        si (plugin.group && !m.isGroup) {
          fallar('grupo', m, esto)
          continuar
        }

        si (plugin.botAdmin && !isBotAdmin) {
          fallar('botAdmin', m, esto)
          continuar
        }

        if (plugin.admin && !isAdmin) {
          fallar('admin', m, esto)
          continuar
        }

        si (plugin.private && m.isGroup) {
          fallar('privado', m, esto)
          continuar
        }

        si (plugin.register === true && _user.registered === false) {
          fallar('unreg', m, esto)
          continuar
        }

        m.isCommand = true

        let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
        if (xp > 200) m.reply('chirrido -_-')
        de lo contrario m.exp += xp

        sea extra = {
          fósforo,
          prefijo usado,
          sin prefijo,
          _args,
          argumentos,
          dominio,
          texto,
          conn: esto,
          participantes,
          metadatos de grupo,
          usuario,
          bot,
          es propietario,
          isBotPrem,
          esPropietario,
          esRAdmin,
          esAdministrador,
          esBotAdmin,
          esPrems,
          esSubBot,
          esPremSubs,
          Actualización de chat,
          __dirname: ___dirname,
          __Nombre del archivo
        }

        intentar {
          esperar plugin.call(this, m, extra)
        } capturar (e) {
          m.error = e
          console.error(e)

          si (e) {
            sea texto = formato(e)
            para (sea key of Object.values(global.APIKeys || {})) {
              texto = texto.replace(new RegExp(clave, 'g'), '#OCULTO#')
            }
          }

          si (e?.nombre) {
            console.error('Error del plugin:', e.name)
          }
        } finalmente {
          si (typeof plugin.after === 'function') {
            intentar {
              esperar plugin.after.call(this, m, extra)
            } capturar (e) {
              console.error(e)
            }
          }
        }

        romper
      }
    }
  } capturar (e) {
    console.error(e)
  } finalmente {
    si (opts?.['queque'] && m?.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
    }

    intentar {
      si (m?.sender && global.db?.data?.users?.[m.sender]) {
        global.db.data.users[m.sender].exp += m.exp || 0
      }

      let stats = global.db?.data?.stats || {}

      si (m?.plugin) {
        ahora = +nueva fecha
        let stat = stats[m.plugin]

        si (estadístico) {
          Si (!isNumber(stat.total)) stat.total = 1
          if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
          Si (!isNumber(stat.last)) stat.last = ahora
          Si (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : ahora
        } demás {
          stat = stats[m.plugin] = {
            total: 1,
            éxito: m.error != null ? 0 : 1,
            último: ahora,
            últimoÉxito: m.error != null ? 0 : ahora
          }
        }

        stat.total += 1
        stat.last = ahora

        si (m.error == null) {
          stat.success += 1
          stat.lastSuccess = ahora
        }
      }
    } capturar (e) {
      console.error(e)
    }

    intentar {
      si (!opts?.['noprint']) {
        await (await import('./lib/print.js')).default(m, this)
      }
    } capturar (e) {
      console.log(m, m?.quoted, e)
    }
  }
}