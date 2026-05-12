import { WAMessageStubType } from '@whiskeysockets/baileys'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
    let _name = await conn.getName(m.sender)
    let sender = '+' + m.sender.replace('@s.whatsapp.net', '') + (_name ? ' ~ ' + _name : '')
    let chat = await conn.getName(m.chat)
    let img
    try {
        if (global.opts['img'])
            img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
    } catch (e) {
        console.error(e)
    }

    let filesize = (m.msg ?
        m.msg.vcard ? m.msg.vcard.length :
        m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength :
        m.text ? m.text.length : 0 : m.text ? m.text.length : 0) || 0

    let me = '+' + (conn.user?.jid || '').replace('@s.whatsapp.net', '')
    const userName = conn.user.name || conn.user.verifiedName || "Bot"
    
    if (m.sender === conn.user?.jid) return

    // Diseño de la consola
    console.log(`${chalk.hex('#FE0041').bold('╭─────────────────────────────────────────···')}
${chalk.hex('#FE0041').bold('│')}${chalk.redBright(' Bot:')} ${chalk.greenBright(me)} ~ ${chalk.magentaBright(userName)}
${chalk.hex('#FE0041').bold('│')}${chalk.yellowBright(' Fecha:')} ${chalk.blueBright(new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }))}
${chalk.hex('#FE0041').bold('│')}${chalk.greenBright(' Evento:')} ${chalk.redBright(m.messageStubType ? WAMessageStubType[m.messageStubType] : 'Mensaje')}
${chalk.hex('#FE0041').bold('│')}${chalk.blueBright(' De:')} ${chalk.redBright(sender)}
${chalk.hex('#FE0041').bold('│')}${chalk.cyanBright(` Chat:`)} ${chalk.greenBright(chat)} ${m.isGroup ? chalk.yellow('(Grupo)') : chalk.magenta('(Privado)')}
${chalk.hex('#FE0041').bold('│')}${chalk.magentaBright(' Tipo:')} ${chalk.yellowBright(m.mtype ? m.mtype.replace(/message$/i, '') : 'Desconocido')}
${chalk.hex('#FE0041').bold('╰─────────────────────────────────────────···')}`)

    if (img) console.log(img.trimEnd())
    
    // ... resto de tu lógica de formateo de texto ...
    if (typeof m.text === 'string' && m.text) {
        console.log(m.error != null ? chalk.red(m.text) : m.isCommand ? chalk.yellow(m.text) : m.text)
    }
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
    console.log(chalk.redBright("¡Archivo lib/print.js actualizado con éxito!"))
})
