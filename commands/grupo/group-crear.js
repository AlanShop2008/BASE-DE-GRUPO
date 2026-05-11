import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❗ *Por favor ingresa un prompt para crear la imagen.*\n\n*Ejemplo:* ${usedPrefix}crear carros realistas`,
    });
  }

  // Notificar al usuario que se está generando la imagen
  await conn.sendMessage(m.chat, {
    text: `🔨 *Se está creando tu imagen... Por favor espera...*`,
  });

  try {
    // Decodificar la URL de la API desde Base64
    const encodedApiUrl = "aHR0cHM6Ly9lbGlhc2FyLXl0LWFwaS52ZXJjZWwuYXBwL2FwaS9haS90ZXh0MmltZw==";
    const apiUrl = `${Buffer.from(encodedApiUrl, "base64").toString()}?prompt=${encodeURIComponent(text)}`;

    // Solicitar la generación de la imagen a la API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error en la solicitud a la API: ${response.statusText}`);
    }

    // Convertir la respuesta a un buffer de imagen
    const imageBuffer = await response.buffer();

    // Enviar la imagen al usuario
    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🖼️ *Aquí está tu imagen:*`,
    });
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar generar la imagen:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.help = ['crear']
handler.tags = ['group']
handler.command = /^crear$/i;

export default handler;
