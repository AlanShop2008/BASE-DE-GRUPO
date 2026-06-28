let handler = async (m, { conn, participants }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

    let target =
      m.mentionedJid?.[0] ||
      m.quoted?.sender ||
      m.sender

    let info = participants.find(p =>
      p.id === target ||
      p.jid === target ||
      p.lid === target ||
      p.id?.includes(target.split('@')[0])
    )

    let jid = info?.jid || info?.id || target
    let lid = info?.lid || info?.lidJid || info?.id || 'No encontrado'

    let texto = `╭─「 🔐 LID DEL MIEMBRO 」
│ 👤 Usuario: ${await conn.getName(jid)}
│ 🆔 JID: ${jid}
│ 🔒 LID: ${lid}
╰──────────────`

    await m.react('🔐')
    await conn.reply(m.chat, texto, m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `✖️ Error al obtener LID:\n\n${e}`, m)
  }
}

handler.help = ['lid @usuario']
handler.tags = ['tools']
handler.command = ['lid', 'getlid']

export default handler