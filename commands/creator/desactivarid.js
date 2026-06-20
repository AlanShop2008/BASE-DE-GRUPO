import fs from 'fs'

const file = './database/grupos_desactivados.json'

function loadDB() {
  if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true })
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2))
  }

  return JSON.parse(fs.readFileSync(file))
}

function saveDB(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn, text, command, isOwner }) => {
  if (!isOwner) {
    return m.reply('❌ Solo el owner puede usar este comando.')
  }

  let db = loadDB()

  if (command === 'gruposid') {
    let groups = await conn.groupFetchAllParticipating()
    let ids = Object.keys(groups)

    if (!ids.length) {
      return m.reply('❌ No encontré grupos.')
    }

    let mensaje = `📋 *LISTA DE GRUPOS E ID*\n\n`

    let i = 1
    for (let id of ids) {
      mensaje += `*${i++}.* ${groups[id].subject}\n`
      mensaje += `🆔 ${id}\n\n`
    }

    return m.reply(mensaje)
  }

  let idGrupo = text?.trim()

  // Si no pones ID y estás dentro de un grupo, usa el ID de ese grupo
  if (!idGrupo && m.isGroup) {
    idGrupo = m.chat
  }

  if (!idGrupo || !idGrupo.endsWith('@g.us')) {
    return m.reply(
`❌ Usa el comando así:

*.desactivarid ID_DEL_GRUPO*

Ejemplo:
*.desactivarid 120363025555555555@g.us*

También puedes usarlo dentro del grupo así:
*.desactivarid*

Para ver tus grupos usa:
*.gruposid*`
    )
  }

  if (command === 'desactivarid') {
    if (db.includes(idGrupo)) {
      return m.reply('⚠️ Ese grupo ya está desactivado.')
    }

    db.push(idGrupo)
    saveDB(db)

    return m.reply(
`✅ *BOT DESACTIVADO*

El bot ya no servirá en este grupo.

🆔 ${idGrupo}

Para activarlo otra vez usa:
*.activarid*`
    )
  }

  if (command === 'activarid') {
    if (!db.includes(idGrupo)) {
      return m.reply('⚠️ Ese grupo no está desactivado.')
    }

    db = db.filter(id => id !== idGrupo)
    saveDB(db)

    return m.reply(
`✅ *BOT ACTIVADO*

El bot ya puede volver a funcionar en este grupo.

🆔 ${idGrupo}`
    )
  }
}

handler.help = ['desactivarid', 'activarid', 'gruposid']
handler.tags = ['owner']
handler.command = ['desactivarid', 'activarid', 'gruposid']
handler.owner = true

export default handler
