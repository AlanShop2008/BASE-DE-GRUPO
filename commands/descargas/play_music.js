import fetch from "node-fetch"
import yts from "yt-search"

if (!global.playSessions) global.playSessions = new Map()

const apiKey = "barboza"

function cleanFileName(name) {
  return (name || "YouTube")
    .replace(/[\\/:*?"<>|]/g, "")
    .slice(0, 80)
}

function getBody(m) {
  return (
    m.text ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    ""
  ).trim()
}

function getSessionKey(m) {
  return `${m.chat}:${m.sender || m.from || m.chat}`
}

async function searchYoutube(input) {
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/
  const videoMatch = input.match(ytRegex)
  const videoId = videoMatch ? videoMatch[1] : null

  if (videoId) {
    try {
      const info = await yts({ videoId })

      return {
        title: info.title || "Video de YouTube",
        url: info.url || `https://youtu.be/${videoId}`,
        videoId,
        thumbnail: info.thumbnail || info.image || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration: info.timestamp || "Desconocida",
        author: info.author?.name || info.author || "Desconocido"
      }
    } catch {
      return {
        title: "Video de YouTube",
        url: `https://youtu.be/${videoId}`,
        videoId,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration: "Desconocida",
        author: "Desconocido"
      }
    }
  }

  const search = await yts(input)
  const result = search.videos?.[0]

  if (!result) return null

  return {
    title: result.title,
    url: result.url,
    videoId: result.videoId,
    thumbnail: result.thumbnail || result.image || `https://i.ytimg.com/vi/${result.videoId}/hqdefault.jpg`,
    duration: result.timestamp || "Desconocida",
    author: result.author?.name || result.author || "Desconocido"
  }
}

async function downloadYoutube(url, format) {
  const apiUrl = `https://getmod-mediahub.vercel.app/api/ytdl?url=${encodeURIComponent(url)}&format=${format}&apikey=${apiKey}`

  const res = await fetch(apiUrl)

  if (!res.ok) {
    throw new Error("LA API NO RESPONDIÓ CORRECTAMENTE.")
  }

  const json = await res.json()

  if (!json.status || !json.dl) {
    throw new Error("NO SE PUDO OBTENER EL ARCHIVO.")
  }

  return json
}

const handler = async (m, { conn, text }) => {
  try {
    const input = (text || "").trim()

    if (!input) {
      return conn.reply(
        m.chat,
        `> ✦ INGRESA EL NOMBRE O LINK DE *YOUTUBE* ✦\n\nEjemplo:\n.play pollito pío`,
        m
      )
    }

    await m.react("🔎")

    const result = await searchYoutube(input)

    if (!result) {
      await m.react("✖️")
      return conn.reply(m.chat, `> ✖ NO SE ENCONTRARON RESULTADOS.`, m)
    }

    const key = getSessionKey(m)

    global.playSessions.set(key, {
      title: result.title,
      url: result.url,
      thumbnail: result.thumbnail,
      time: Date.now()
    })

    const caption = `
╭─「 🎵 YOUTUBE PLAY 」
│
│ 📌 *Título:* ${result.title}
│ 👤 *Canal:* ${result.author}
│ ⏱️ *Duración:* ${result.duration}
│
╰───────────────

*Elige una opción respondiendo con el número:*

*1.* Canción MP3
*2.* MP3 como archivo
*3.* Video MP4

> Responde solo con: *1*, *2* o *3*
> Esta búsqueda vence en 5 minutos.
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.thumbnail },
        caption
      },
      { quoted: m }
    )

    await m.react("✔️")

  } catch (e) {
    console.error(e)
    await m.react("✖️")
    return conn.reply(
      m.chat,
      `> ⚠ ERROR: ${e.message || e}`,
      m
    )
  }
}

handler.before = async (m, { conn }) => {
  try {
    const body = getBody(m)

    if (!["1", "2", "3"].includes(body)) return

    const key = getSessionKey(m)
    const session = global.playSessions.get(key)

    if (!session) return

    const expired = Date.now() - session.time > 5 * 60 * 1000

    if (expired) {
      global.playSessions.delete(key)
      return conn.reply(
        m.chat,
        `> ⚠ EL MENÚ DE PLAY YA EXPIRÓ.\n\nVuelve a buscar con:\n.play nombre de la canción`,
        m
      )
    }

    await m.react("⏳")

    const option = body
    const format = option === "3" ? "mp4" : "mp3"

    const json = await downloadYoutube(session.url, format)

    const title = cleanFileName(json.title || session.title)

    if (option === "1") {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.dl },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg"
        },
        { quoted: m }
      )
    }

    if (option === "2") {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: json.dl },
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg"
        },
        { quoted: m }
      )
    }

    if (option === "3") {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.dl },
          caption: `> 🎬 ${title}`,
          fileName: `${title}.mp4`,
          mimetype: "video/mp4"
        },
        { quoted: m }
      )
    }

    global.playSessions.delete(key)
    await m.react("✔️")
    return true

  } catch (e) {
    console.error(e)
    await m.react("✖️")
    return conn.reply(
      m.chat,
      `> ⚠ ERROR: ${e.message || e}`,
      m
    )
  }
}

handler.command = ["play"]
handler.help = ["play <texto/link>"]
handler.tags = ["media"]

export default handler
