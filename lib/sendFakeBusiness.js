import fs from 'fs'
import { proto, generateWAMessageFromContent, prepareWAMessageMedia, WA_DEFAULT_EPHEMERAL } from '@whiskeysockets/baileys'

/**
 * Envía un mensaje interactivo tipo WhatsApp Business con imagen.
 * Uso desde plugins:
 * await conn.sendFakeBusiness(m.chat, texto, './storage/img/catalogo.png', m)
 */
export async function sendFakeBusiness(conn, jid, text = '', imagePath = './storage/img/catalogo.png', quoted, options = {}) {
    try {
        const fakePath = options.fakePath || './storage/img/fake.jpg'
        const thumbnail = fs.existsSync(fakePath) ? fs.readFileSync(fakePath) : undefined

        let imageSource
        if (Buffer.isBuffer(imagePath)) {
            imageSource = imagePath
        } else if (typeof imagePath === 'string' && /^https?:\/\//i.test(imagePath)) {
            imageSource = { url: imagePath }
        } else if (typeof imagePath === 'string' && fs.existsSync(imagePath)) {
            imageSource = fs.readFileSync(imagePath)
        } else {
            imageSource = fs.existsSync('./storage/img/catalogo.png')
                ? fs.readFileSync('./storage/img/catalogo.png')
                : undefined
        }

        const media = imageSource
            ? await prepareWAMessageMedia(
                { image: imageSource },
                { upload: conn.waUploadToServer }
            )
            : {}

        const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
                text
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
                text: options.footer || 'Alan Shop'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
                title: options.title || 'WhatsApp Business ✅',
                subtitle: options.subtitle || 'Contacto',
                hasMediaAttachment: !!media.imageMessage,
                imageMessage: media.imageMessage || null
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: options.buttons || [],
                messageParamsJson: ''
            }),
            contextInfo: {
                mentionedJid: typeof conn.parseMention === 'function' ? conn.parseMention(text || '') : [],
                externalAdReply: {
                    title: options.adTitle || 'WhatsApp Business ✅',
                    body: options.adBody || 'Contacto',
                    thumbnail,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    showAdAttribution: false,
                    sourceUrl: options.sourceUrl || 'https://wa.me/'
                }
            }
        })

        const msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage
                }
            }
        }, {
            userJid: conn.user?.jid || conn.user?.id,
            quoted,
            upload: conn.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL
        })

        await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
        return msg
    } catch (e) {
        console.error('[sendFakeBusiness] Error:', e)
        return conn.sendMessage(jid, { text }, { quoted })
    }
}