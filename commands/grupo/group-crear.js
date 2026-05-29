import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Ingresa una descripción para crear la imagen.*\n\n📌 Ejemplo:\n*${usedPrefix + command} un carro deportivo morado, realista, 4k*`
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    text: `🎨 *Creando tu imagen...*\n⏳ Espera unos segundos.`
  }, { quoted: m })

  try {
    const prompt = encodeURIComponent(text)
    const seed = Math.floor(Math.random() * 999999)

    const apiUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&model=flux&enhance=true`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`API respondió con estado: ${response.status}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🖼️ *Imagen creada con IA*\n\n📝 Prompt: ${text}`
    }, { quoted: m })

  } catch (error) {
    console.error('Error al generar la imagen:', error)
    await conn.sendMessage(m.chat, {
      text: `❌ *No pude generar la imagen.*\n\nError: ${error.message}`
    }, { quoted: m })
  }
}

handler.help = ['crear']
handler.tags = ['group']
handler.command = /^crear$/i

export default handler
