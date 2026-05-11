const handler = async (m, { conn }) => {
  let mentionedJid = await m.mentionedJid
  let user = mentionedJid && mentionedJid.length 
      ? mentionedJid[0] 
      : m.quoted && await m.quoted.sender 
      ? await m.quoted.sender 
      : null

  let avatar = await conn.profilePictureUrl(user, 'image')
    .catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')

  let poemas = [
    `💖✨ En tu sonrisa vive mi alegría, en tu abrazo descansa mi paz, eres mi sueño hecho vida, mi razón de amar. 🌹`,

    `🌙⭐ Bajo la luna pienso en ti, cada estrella me susurra tu nombre, eres mi destino, mi poesía, mi amor eterno y noble. 💕`,

    `🌹 En tu mirada florece la esperanza, en tu voz canta la ternura, contigo todo es belleza, contigo todo es dulzura. 💖`,

    `✨ Eres mi refugio, mi calma, la melodía que alegra mi alma, contigo quiero caminar, hasta la eternidad. 🌹`
  ]

  let texto = poemas[Math.floor(Math.random() * poemas.length)]

  await conn.sendFile(m.chat, avatar, 'minovia.jpg', texto, m)
}

handler.help = ['minovia']
handler.tags = ['fun', 'love']
handler.command = /^(minovia)$/i

export default handler
