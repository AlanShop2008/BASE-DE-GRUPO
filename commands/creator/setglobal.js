const handler = async (m, { conn, command }) => {
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  if (!global.db.data.chats[m.chat].setcmd) global.db.data.chats[m.chat].setcmd = {}

  if (command === 'listset') {
    let lista = Object.keys(global.db.data.chats[m.chat].setcmd)
    if (!lista.length) return conn.reply(m.chat, '⚠️ No hay comandos creados en este grupo.', m)

    return conn.reply(
      m.chat,
      `📋 *COMANDOS DEL GRUPO*\n\n${lista.map(x => `• .${x}`).join('\n')}`,
      m
    )
  }
}

handler.help = ['listset']
handler.tags = ['group']
handler.command = /^listset$/i
handler.group = true

export default handler

export async function before(m, { conn, isAdmin, isOwner, isROwner }) {
  if (!m.text) return false
  if (!m.isGroup) return false

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  if (!global.db.data.chats[m.chat].setcmd) global.db.data.chats[m.chat].setcmd = {}

  let text = m.text.trim()
  let prefix = text[0]

  if (!['.', '#', '/', '!'].includes(prefix)) return false

  let body = text.slice(1)
  let comando = body.split(/\s+/)[0].toLowerCase()
  let contenido = body.slice(comando.length).trim()

  if (comando.startsWith('set') && comando.length > 3) {
    if (!isAdmin && !isOwner && !isROwner) {
      await conn.reply(m.chat, '🚫 Solo los admins pueden crear comandos en este grupo.', m)
      return true
    }

    let nombre = comando.slice(3).toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, '')

    if (!contenido && m.quoted && m.quoted.text) {
      contenido = m.quoted.text
    }

    if (!contenido) {
      await conn.reply(m.chat, `⚠️ Uso correcto:\n\n.set${nombre} texto\n\nEjemplo:\n.settacos tacos 7 pesos`, m)
      return true
    }

    global.db.data.chats[m.chat].setcmd[nombre] = contenido

    await conn.reply(m.chat, `✅ Comando creado en este grupo.\n\nAhora usa: *.${nombre}*`, m)
    return true
  }

  if (comando.startsWith('del') && comando.length > 3) {
    if (!isAdmin && !isOwner && !isROwner) {
      await conn.reply(m.chat, '🚫 Solo los admins pueden eliminar comandos en este grupo.', m)
      return true
    }

    let nombre = comando.slice(3).toLowerCase().replace(/[^a-zA-Z0-9ñÑ_-]/g, '')

    if (!global.db.data.chats[m.chat].setcmd[nombre]) {
      await conn.reply(m.chat, '❌ Ese comando no existe en este grupo.', m)
      return true
    }

    delete global.db.data.chats[m.chat].setcmd[nombre]

    await conn.reply(m.chat, `✅ Comando eliminado: *.${nombre}*`, m)
    return true
  }

  if (global.db.data.chats[m.chat].setcmd[comando]) {
    await conn.reply(m.chat, global.db.data.chats[m.chat].setcmd[comando], m)
    return true
  }

  return false
}
