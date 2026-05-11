let autoadminGlobal = global.autoadminGlobal ?? true
global.autoadminGlobal = autoadminGlobal

const handler = async (m, { conn, isAdmin, isBotAdmin, isROwner, usedPrefix, command, args }) => {
  // Si el comando está desactivado globalmente, avisa
  if (!global.autoadminGlobal && !isROwner) {
    return conn.reply(m.chat, '> ⓘ \`El sistema de autoadmin está desactivado globalmente\`', m)
  }

  // Si el bot no es admin, avisa
  if (!isBotAdmin) {
    return conn.reply(m.chat, '> ⓘ \`Necesito ser administradora para poder promover usuarios\`', m)
  }

  // Si ya es admin, avisa
  if (isAdmin) {
    return conn.reply(m.chat, '> ⓘ \`Ya tienes privilegios de administrador en este grupo\`', m)
  }

  try {
    await m.react('🕒')
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.react('✅️')
    await conn.reply(m.chat, `> ⓘ \`Usuario promovido:\` *@${m.sender.split('@')[0]}*`, m, { mentions: [m.sender] })

  } catch (error) {
    await m.react('❌️')
    await conn.reply(m.chat, `> ⓘ \`Error al promover:\` *${error.message}*`, m)
  }
}

handler.help = ['autoadmin']
handler.tags = ['owner']
handler.command = ['autoadmin']
handler.group = true
handler.rowner = true

export default handler
