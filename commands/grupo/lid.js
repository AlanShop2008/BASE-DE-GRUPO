let handler = async (m, { conn, participants, groupMetadata }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

    let metadata = groupMetadata || await conn.groupMetadata(m.chat)
    let lista = participants || metadata.participants || []
    let groupName = metadata.subject || await conn.getName(m.chat)

    let texto = `*╭┈┈┈⊰* 『 *Participantes* 』  
*┊* 👥 *Grupo:* ${groupName}
*┊* 🔢 *Total:* ${lista.length} miembros  
*╰┈┈┈┈┈┈┈┈┈⊰*\n`

    let mentions = []

    for (let i = 0; i < lista.length; i++) {
      let user = lista[i]

      let jid = user.id || user.jid || user.lid || ''
      let lid =
        user.lid ||
        user.lidJid ||
        (user.id?.endsWith('@lid') ? user.id : null) ||
        (user.jid?.endsWith('@lid') ? user.jid : null) ||
        jid

      let mention = jid
      mentions.push(mention)

      let rol = user.admin === 'superadmin'
        ? '👑 *Propietario*'
        : user.admin === 'admin'
          ? '🛡️ *Administrador*'
          : '👤 *Miembro*'

      texto += `
╭─✿ *Usuario ${i + 1}* ✿
│  *Nombre:* @${mention.split('@')[0]}
│  *JID:* ${lid}
│  *Rol:* ${rol}
╰───────────────✿
`
    }

    await m.react('🔐')
    await conn.sendMessage(m.chat, {
      text: texto,
      mentions
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al obtener participantes:\n\n${e}`, m)
  }
}

handler.help = ['lid']
handler.tags = ['tools']
handler.command = ['lid', 'lids', 'participanteslid']

export default handler