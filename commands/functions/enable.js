let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let onc = ['enable', 'activar', 'on']
  let isEnable = onc.includes(command)
  let type = (args[0] || '').toLowerCase()

  const features = {
    welcome: { scope: 'group', key: 'welcome' },
    bv: { scope: 'group', key: 'welcome' },
    bienvenida: { scope: 'group', key: 'welcome' },

    antibot: { scope: 'group', key: 'antiBot' },
    antibots: { scope: 'group', key: 'antiBot' },
    antisubbots: { scope: 'group', key: 'antiBot2' },
    antisub: { scope: 'group', key: 'antiBot2' },
    antisubot: { scope: 'group', key: 'antiBot2' },
    antibot2: { scope: 'group', key: 'antiBot2' },

    antitoxic: { scope: 'group', key: 'antitoxic', toggle: true },
    autolevelup: { scope: 'group', key: 'autolevelup' },
    autonivel: { scope: 'group', key: 'autolevelup' },

    modoadmin: { scope: 'group', key: 'modoadmin' },
    soloadmin: { scope: 'group', key: 'modoadmin' },

    antiver: { scope: 'group', key: 'antiver' },
    antiocultar: { scope: 'group', key: 'antiver' },
    antiviewonce: { scope: 'group', key: 'antiver' },

    reaction: { scope: 'group', key: 'reaction' },
    reaccion: { scope: 'group', key: 'reaction' },
    emojis: { scope: 'group', key: 'reaction' },

    audios: { scope: 'group', key: 'audios' },
    audiosbot: { scope: 'group', key: 'audios' },
    botaudios: { scope: 'group', key: 'audios' },

    antilink: { scope: 'group', key: 'antiLink' },
    antilink2: { scope: 'group', key: 'antiLink2', toggle: true },
    allantilink: { scope: 'group', key: 'allantiLink' },

    detect: { scope: 'group', key: 'detect' },
    configuraciones: { scope: 'group', key: 'detect' },
    avisodegp: { scope: 'group', key: 'detect' },

    autoresponder: { scope: 'group', key: 'autoresponder' },
    autorespond: { scope: 'group', key: 'autoresponder' },

    simi: { scope: 'group', key: 'simi' },
    autosimi: { scope: 'group', key: 'simi' },
    simsimi: { scope: 'group', key: 'simi' },

    antiarabes: { scope: 'group', key: 'onlyLatinos' },
    antiarab: { scope: 'group', key: 'onlyLatinos' },

    nsfw: { scope: 'group', key: 'nsfw' },
    nsfwhot: { scope: 'group', key: 'nsfw' },
    nsfwhorny: { scope: 'group', key: 'nsfw' },

    delete: { scope: 'group', key: 'delete' },
    antidelete: { scope: 'group', key: 'delete' },
    antieliminar: { scope: 'group', key: 'delete' },

    noprefix: { scope: 'bot', key: 'noprefix' },
    restrict: { scope: 'bot', key: 'restrict' },
    public: { scope: 'bot', key: 'public', invert: true, requireROwner: true },

    antiPrivate: { scope: 'bot', key: 'antiPrivate', requireROwner: true },
    antipriv: { scope: 'bot', key: 'antiPrivate', requireROwner: true },
    antiprivado: { scope: 'bot', key: 'antiPrivate', requireROwner: true },

    antiPrivate2: { scope: 'bot', key: 'antiPrivate2', requireROwner: true },
    antipriv2: { scope: 'bot', key: 'antiPrivate2', requireROwner: true },
    antiprivado2: { scope: 'bot', key: 'antiPrivate2', requireROwner: true },

    antiPrivate3: { scope: 'bot', key: 'antiPrivate3', requireROwner: true },
    antipriv3: { scope: 'bot', key: 'antiPrivate3', requireROwner: true },
    antiprivado3: { scope: 'bot', key: 'antiPrivate3', requireROwner: true },

    gconly: { scope: 'bot', key: 'gconly', requireROwner: true },
    onlygp: { scope: 'bot', key: 'gconly', requireROwner: true },
    sologrupos: { scope: 'bot', key: 'gconly', requireROwner: true },

    antiSpam: { scope: 'bot', key: 'antiSpam', requireROwner: true },
    antispam: { scope: 'bot', key: 'antiSpam', requireROwner: true },
    antispamosos: { scope: 'bot', key: 'antiSpam', requireROwner: true },

    autobio: { scope: 'bot', key: 'autobio', requireROwner: true },
    status: { scope: 'bot', key: 'autobio', requireROwner: true },
    bio: { scope: 'bot', key: 'autobio', requireROwner: true },

    jadibotmd: { scope: 'bot', key: 'jadibotmd', requireROwner: true },
    serbot: { scope: 'bot', key: 'jadibotmd', requireROwner: true },
    subbots: { scope: 'bot', key: 'jadibotmd', requireROwner: true },

    autoread: { scope: 'bot', key: 'autoread', requireROwner: true },
    autoleer: { scope: 'bot', key: 'autoread', requireROwner: true },
    leermensajes: { scope: 'bot', key: 'autoread', requireROwner: true },

    document: { scope: 'user', key: 'useDocument' }
  }

  const conf = features[type]
  if (!conf) {
    let opcigc = `🪶 *FUNCIONES SOLO PARA GRUPOS (admins/owners):*\n
- welcome / bv / bienvenida
- antibot / antibots / antisubbots / antisub / antisubot / antibot2
- antitoxic
- autolevelup / autonivel
- modoadmin / soloadmin
- antiver / antiocultar / antiviewonce
- reaction / reaccion / emojis
- audios / audiosbot / botaudios
- antilink / antilink2 / allantilink
- detect / configuraciones / avisodegp
- autoresponder / autorespond
- simi / autosimi / simsimi
- antiarabes / antiarab
- nsfw / nsfwhot / nsfwhorny
- delete / antidelete / antieliminar
`

    let opcipriv = `🪶 *FUNCIONES DEL BOT (solo owners/rowner):*\n
- noprefix
- restrict
- public
- antiPrivate / antipriv / antiprivado
- antiPrivate2 / antipriv2 / antiprivado2
- antiPrivate3 / antipriv3 / antiprivado3
- gconly / onlygp / sologrupos
- antiSpam / antispam / antispamosos
- autobio / status / bio
- jadibotmd / serbot / subbots
- autoread / autoleer / leermensajes
`

    let opciuser = `🪶 *FUNCIONES DE USUARIO (cualquiera):*\n
- document
`

    return conn.reply(m.chat, `🪐 *\`OPCIONES DISPONIBLES\`*\n\n${opcigc}\n${opcipriv}\n${opciuser}`, m, fake)
  }

  if (conf.scope === 'group') {
    if (!m.isGroup) {
      global.dfail('group', m, conn)
      return
    }
    if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      return
    }
  }

  if (conf.scope === 'bot') {
    if (!isOwner) {
      global.dfail('owner', m, conn)
      return
    }
        if (conf.requireROwner && !isROwner) {
      global.dfail('rowner', m, conn)
      return
    }
  }

  const chat = global.db.data.chats[m.chat] || {}
  const bot = global.db.data.settings[conn.user.jid] || {}
  const user = global.db.data.users[m.sender] || {}

  switch (conf.scope) {
    case 'group':
      chat[conf.key] = conf.toggle ? !chat[conf.key] : isEnable
      break
    case 'bot':
      bot[conf.key] = conf.invert ? !isEnable : isEnable
      if (conf.key === 'gconly') global.opts['gconly'] = bot[conf.key]
      break
    case 'user':
      user[conf.key] = isEnable
      break
  }

  conn.reply(m.chat, `🪐 La función *${type}* fue ${isEnable ? 'activada' : 'desactivada'} correctamente.`, m, fake)
}

handler.help = ['on 🟢', 'off 🔴']
handler.tags = ['nable']
handler.command = ['enable', 'disable', 'activar', 'desactivar', 'on', 'off']

export default handler
