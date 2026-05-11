let handler = async (m, { conn, text, participants, usedPrefix, command }) => {

  let groupName2 = await conn.getName(m.chat)
  let ppUrl
  try {
    ppUrl = await conn.profilePictureUrl(m.chat, 'image')
  } catch {
    ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png' 
  }

  const fgrupo = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      id: "Undefined"
    },
    message: {
      locationMessage: {
        name: groupName2, 
        jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
      }
    }
  }

  if (!text && !m.quoted && !m.mentionedJid?.length) {
    return conn.reply(m.chat, `🪐 *Debes responder, mencionar o escribir un número para quitar.*`, m, { quoted: fgrupo })
  }

  let mentionedJid = await m.mentionedJid
  let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
  
  if (!user) return

  if (conn.user.jid.includes(user)) return m.reply(`✳️ No puedo hacer un auto kick`, fgrupo)

  try {
    const groupInfo = await conn.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    if (user === conn.user.jid) return
    if (user === ownerGroup) return
    if (user === ownerBot) return

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    m.reply(`✅ Usuario eliminado con éxito`, fgrupo) 

    await m.react('✅')

  } catch (e) {
    await m.react('❌')
    m.reply(`❌ Ocurrió un error al intentar expulsar`, fgrupo)
  }
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'sacar,']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
