import fs from "fs";

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const filePath = "./ventas365.json";

  if (!fs.existsSync(filePath)) {
    return conn.sendMessage(chatId, { text: "❌ No hay datos guardados aún." }, { quoted: msg });
  }

  const ventas = JSON.parse(fs.readFileSync(filePath));
  const data = ventas[chatId]?.setcombos;

  if (!data || (!data.texto && !data.imagen)) {
    return conn.sendMessage(chatId, { text: "❌ No hay contenido guardado con setcombos en este grupo." }, { quoted: msg });
  }

  if (data.imagen) {
    const buffer = Buffer.from(data.imagen, "base64");
    await conn.sendMessage(chatId, {
      image: buffer,
      caption: data.texto || "Contenido combos"
    }, { quoted: msg });
  } else {
    await conn.sendMessage(chatId, { text: data.texto }, { quoted: msg });
  }
};


handler.help = ['combos']
handler.tags = ['ventas']
handler.command = ["combos"];
export default handler
