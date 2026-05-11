let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let mentionedJid = await m.mentionedJid
  let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
  
  if (!user) return

  try {
    const groupInfo = await conn.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    if (user === conn.user.jid) return
    if (user === ownerGroup) return
    if (user === ownerBot) return
    
    await m.reply("✨🎩 ¡Bienvenidos al espectáculo de magia de esta noche! 🎩✨")
    await delay(2000)
    await m.reply("🔮 Hoy, haremos algo extraordinario... 🔮")
    await delay(2000)
    await m.reply("🧙‍♂️ Prepárense... Miren con atención... 🧙‍♂️")
    await delay(2000)
    await m.reply("✨ Sim Salabim... Haciendo desaparecer lo inesperado... ✨")
    await delay(2000)
    await m.reply("🎩 Abracadabra... Miren... Algo asombroso está a punto de suceder... 🎩")
    await delay(2000)
    await m.reply("🪄 Hocus Pocus... Listo para hacer desaparecer a alguien... 🪄")
    await delay(2000)
    await m.reply("✨ ¡Prepárense!... Todo desaparecerá en un instante... ✨")
    await delay(2000)
    await m.reply("🌟 *¡Y...!* 🌟")
    await delay(1000)
    await m.reply("💥 *¡Puf!* ¡Este miembro ha desaparecido del grupo... 💥")
    await delay(2000)
    
    // Expulsar al usuario
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    
    await m.react('✅')

  } catch (e) {
    await m.react('❌')
  }
}

handler.help = ['truco']
handler.tags = ['group']
handler.command = ['truco']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
