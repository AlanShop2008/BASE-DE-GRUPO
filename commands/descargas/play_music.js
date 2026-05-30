import fetch from "node-fetch"
import yts from "yt-search"

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `> ✦ POR FAVOR INGRESA EL NOMBRE O LINK DE *YOUTUBE* ✦`, m)
    }

    await m.react("⏳")

    const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? "https://youtu.be/" + videoMatch[1] : text
    const search = await yts(query)
    const result = videoMatch 
      ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] 
      : search.all[0]

    if (!result) throw "> ✖ NO SE ENCONTRARON RESULTADOS."

    const { title, url } = result

    const isAudio = ["play", "yta", "ytmp3", "playaudio"].includes(command)
    const format = isAudio ? "mp3" : "mp4"
    const apiKey = "barboza"

    const apiUrl = `https://getmod-mediahub.vercel.app/api/ytdl?url=${encodeURIComponent(url)}&format=${format}&apikey=${apiKey}`

    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.dl) {
      throw "> ⚠ NO SE PUDO OBTENER EL ARCHIVO."
    }

    if (isAudio) {
      await conn.sendMessage(m.chat, {
        audio: { url: json.dl },
        fileName: `${json.title || title}.mp3`,
        mimetype: "audio/mpeg"
      }, { quoted: m })

    } else {
      await conn.sendMessage(m.chat, {
        video: { url: json.dl },
        fileName: `${json.title || title}.mp4`,
        mimetype: "video/mp4"
      }, { quoted: m })
    }

    await m.react("✔️")

  } catch (e) {
    console.error(e)
    await m.react("✖")
    return conn.reply(m.chat, `> ⚠ ERROR: ${e.message || e}`, m)
  }
}

handler.command = ["play", "play2"]
handler.help = ["play <texto>", "play2 <texto>"]
handler.tags = ["media"]

export default handler
