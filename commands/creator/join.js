let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let delay = time => new Promise(res => setTimeout(res, time))

  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) throw `✳️ Envie el link del Grupo\n\n 📌 Ejemplo:\n *${usedPrefix + command}* <linkwa> <dias>`
  if (!code) throw `✳️ Link inválido`
  if (!args[1]) throw `📌 Falta el número de días\n\n Ejemplo:\n *${usedPrefix + command}* <linkwa> 2`
  if (isNaN(args[1])) throw `✳️ Solo número, que representa los días que el bot estará en el grupo!`

  let owbot = global.owner[1] 
  m.reply(`😎 Espere 3 segundos, me uniré al grupo`)
  await delay(3000)

  try {
    let res = await conn.groupAcceptInvite(code)
    let b = await conn.groupMetadata(res)
    let d = b.participants.map(v => v.id)
    let nDays = 86400000 * args[1]  
    let now = Date.now()

    if (now < global.db.data.chats[res].expired) global.db.data.chats[res].expired += nDays
    else global.db.data.chats[res].expired = now + nDays

    await m.reply(`✅ Me uní correctamente al grupo *${await conn.getName(res)}*\n\nEl bot saldrá automáticamente después de:\n${msToDate(global.db.data.chats[res].expired - now)}`)

    await conn.reply(res, `🏮 Hola a todos 👋🏻\n\nSoy *${Botname}*, invitado por *${m.name}*\n\nPara ver el menú escribe:\n*${usedPrefix}menu*\n\n⏳ Saldré automáticamente después de:\n${msToDate(global.db.data.chats[res].expired - now)}`, m, { mentions: d })

    await conn.reply(global.owner[1]+'@s.whatsapp.net', 
      `≡ *INVITACIÓN A GRUPO*\n\n@${m.sender.split('@')[0]} invitó al bot *${conn.user.name}* al grupo\n\n*${await conn.getName(res)}*\n\n📌 Enlace: ${args[0]}\n\n⏳ El bot saldrá automáticamente después de:\n${msToDate(global.db.data.chats[res].expired - now)}`, 
      null, {mentions: [m.sender]})

  } catch (e) {
    conn.reply(global.owner[1]+'@s.whatsapp.net', e)
    throw `✳️ Lo siento, el bot no puede unirse a grupos`
  }
}

handler.help = ['join <chat.whatsapp.com> <dias>']
handler.tags = ['owner']
handler.command = ['join', 'invite'] 
handler.owner = true 

export default handler


setInterval(async () => {
  let now = Date.now()
  for (let id in global.db.data.chats) {
    let chat = global.db.data.chats[id]
    if (chat.expired) {
      let tiempoRestante = chat.expired - now

      if (tiempoRestante > 0 && tiempoRestante <= 3 * 24 * 60 * 60 * 1000) {
        try {
          let reminder = `💳 *Recordatorio de pago*\n\n⏳ El bot saldrá automáticamente de este grupo en:\n${msToDate(tiempoRestante)}\n\nPara seguir usando el botcito, es necesario realizar el pago correspondiente.\n\n📌 Contacta con el administrador para renovar.`
          await conn.sendMessage(id, { text: reminder })
        } catch (e) {
          console.error(`Error al enviar recordatorio en grupo ${id}:`, e)
        }
      }

      if (tiempoRestante <= 0) {
        try {
          await conn.groupLeave(id)
          await conn.reply(global.owner[1]+'@s.whatsapp.net', 
            `⏳ El bot salió automáticamente del grupo *${await conn.getName(id)}* porque se cumplió el tiempo de permanencia.`)
          chat.expired = null
        } catch (e) {
          console.error(`Error al salir del grupo ${id}:`, e)
        }
      }
    }
  }
}, 6 * 60 * 60 * 1000) 

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, 'd ', h, 'h ', m, 'm ', s, 's '].map(v => v.toString().padStart(2, 0)).join('')
}
