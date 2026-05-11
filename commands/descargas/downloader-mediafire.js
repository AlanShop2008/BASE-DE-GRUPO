import fetch from 'node-fetch';

// Mensajes predefinidos para reutilización
const mssg = {
    noLink: (platform) => `🥕 *Por favor, proporciona un enlace de ${platform}*.`,
    invalidLink: (platform) => `❗️ El enlace proporcionado no es válido de ${platform}. Por favor verifica el enlace.`,
    error: '❗️ Ocurrió un error al intentar procesar la descarga 🧐.',
    fileNotFound: '❗️ No se pudo encontrar el archivo en Mediafire. Asegúrate de que el enlace sea correcto.',
    fileTooLarge: '❗️ El archivo es demasiado grande (más de 650 MB). No se puede procesar.',
    busy: '❗️ El servidor está procesando otra solicitud. Por favor, espera a que termine.',
};

// Estado del servidor
let isProcessing = false;

// Función para enviar respuestas rápidas
const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, { 
        text: texto, 
    }, { quoted: m });
};

// Función para verificar si la URL proporcionada es válida
const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.*$/i;
    return regex.test(url);
};

// Función para extraer el nombre del archivo desde el enlace
const extractFileNameFromLink = (url) => {
    const match = url.match(/\/file\/[^/]+\/(.+?)\/file$/i);
    if (match) {
        return decodeURIComponent(match[1].replace(/%20/g, ' ')); // Decodificar espacios y caracteres especiales
    }
    return null;
};

// Función para determinar el tipo MIME según la extensión del archivo
const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
        'apk': 'application/vnd.android.package-archive',
        'zip': 'application/zip',
        'rar': 'application/vnd.rar',
        'mp4': 'video/mp4',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'pdf': 'application/pdf',
        'mp3': 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

// Handler principal para los comandos
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (command === 'mediafire') {
        if (!text) {
            return reply(`❗️ *Por favor, ingresa un enlace de Mediafire*\n\nEjemplo: ${usedPrefix + command} https://www.mediafire.com/file/abcd1234/file_name`, conn, m);
        }

        // Verificar si el servidor está ocupado
        if (isProcessing) {
            return reply(mssg.busy, conn, m);
        }

        // Verificar si el enlace proporcionado es válido
        if (!isValidUrl(text)) {
            return reply(mssg.invalidLink('Mediafire'), conn, m);
        }

        try {
            isProcessing = true; // Marcar el servidor como ocupado
            console.log(`Procesando enlace: ${text}`);

            // Extraer el nombre del archivo desde el enlace
            let fileName = extractFileNameFromLink(text);
            if (!fileName) {
                fileName = 'archivo_descargado'; // Asignar nombre genérico si no se pudo extraer
            }

            const apiUrl = `https://www.dark-yasiya-api.site/download/mfire?url=${encodeURIComponent(text)}`;
            const apiResponse = await fetch(apiUrl);
            const data = await apiResponse.json();

            if (data.status && data.result && data.result.dl_link) {
                const downloadUrl = data.result.dl_link;
                const fileSize = parseFloat(data.result.size.replace(/[^0-9.]/g, '')); // Extraer tamaño en MB

                // Verificar el tamaño del archivo
                if (fileSize > 650) {
                    isProcessing = false; // Liberar el servidor
                    return reply(mssg.fileTooLarge, conn, m);
                }

                const mimeType = getMimeType(fileName);

                await conn.sendMessage(m.chat, {
                    document: { url: downloadUrl },
                    mimetype: mimeType,
                    fileName: fileName,
                }, { quoted: m });

            } else {
                isProcessing = false; // Liberar el servidor
                return reply(mssg.fileNotFound, conn, m);
            }

        } catch (error) {
            console.error('Error con la API de Dark Yasiya:', error.message);
            return reply(mssg.error, conn, m);

        } finally {
            isProcessing = false; // Liberar el servidor
        }
    }
};

// Comando para activar la función de descarga desde Mediafire
handler.help = ['mediafire *<link>*']
handler.tags = ['downloader']
handler.command = /^(mediafire|mfire)$/i;

export default handler;
