import fs from 'fs'

const file = './database/antidelet.json'

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

let handler = async (m, { conn, text, command, isAdmin, isOwner }) => {
  if (!m.isGroup) {
    return m.reply('❌ Este comando solo funciona en grupos.')
  }

  if (!isAdmin && !isOwner) {
    return m.reply('❌ Solo admins del grupo pueden usar este comando.')
  }

  let db = loadDB()
  let chat = m.chat
  let opcion = ''

  if (command === 'on' || command === 'off') {
    opcion = command
    if ((text || '').trim().toLowerCase() !== 'antidelet') return
  }

  if (command === 'antidelet') {
    opcion = (text || '').trim().toLowerCase()
  }

  if (!['on', 'off'].includes(opcion)) {
    return m.reply(
`⚙️ *ANTIDELET*

Usa:

*.on antidelet*
*.off antidelet*

También puedes usar:

*.antidelet on*
*.antidelet off*`
    )
  }

  if (opcion === 'on') {
    if (db.includes(chat)) {
      return m.reply('⚠️ El *antidelet* ya está activado en este grupo.')
    }

    db.push(chat)
    saveDB(db)

    return m.reply(
`✅ *ANTIDELET ACTIVADO*

Ahora si alguien elimina un mensaje, el bot lo volverá a mostrar en el grupo.`
    )
  }

  if (opcion === 'off') {
    if (!db.includes(chat)) {
      return m.reply('⚠️ El *antidelet* ya está desactivado en este grupo.')
    }

    db = db.filter(id => id !== chat)
    saveDB(db)

    return m.reply(
`❌ *ANTIDELET DESACTIVADO*

El bot ya no mostrará mensajes eliminados en este grupo.`
    )
  }
}

handler.help = ['on antidelet', 'off antidelet', 'antidelet on', 'antidelet off']
handler.tags = ['group']
handler.command = ['on', 'off', 'antidelet']
handler.group = true

export default handler
