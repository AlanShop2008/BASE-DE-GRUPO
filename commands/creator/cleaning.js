import { tmpdir } from 'os'
import path, { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync, promises as fs
} from 'fs'

let handler = async (m, { conn, usedPrefix, __dirname, args, command }) => {

if (global.conn.user.jid !== conn.user.jid) {
return conn.reply(m.chat, '🚩 *Utiliza este comando directamente en el número principal del Bot*', m, rcanal)
}

try {
switch (command) {
case 'dsowner':
case 'delzero':
case 'clearallsession': {
await conn.reply(m.chat, '🚩 *Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...*', m, rcanal)
m.react(rwait)

let sessionPath = `${global.jadi || 'CrowJadiBot'}`

if (!existsSync(sessionPath)) return conn.reply(m.chat, '🚩 *La carpeta está vacía*', m, rcanal)

let files = await fs.readdir(sessionPath)
let filesDeleted = 0
for (const file of files) {
if (file !== 'creds.json') {
await fs.unlink(path.join(sessionPath, file))
filesDeleted++
}}

if (filesDeleted === 0) {
conn.reply(m.chat, '🚩 *La carpeta está vacía*', m, rcanal)
} else {
m.react(done)
conn.reply(m.chat, `🚩 *Se eliminaron ${filesDeleted} archivos de sesión, excepto creds.json*`, m, rcanal)
conn.reply(m.chat, `🚩 *¡Hola! ¿logras verme?*`, m, rcanal)
}
break
}

case 'cleartmp': {
const tmpDirs = [tmpdir(), join(__dirname, '../tmp')]
let filesDeleted = 0

tmpDirs.forEach(dir => {
if (existsSync(dir)) {
readdirSync(dir).forEach(file => {
let filepath = join(dir, file)
try {
const stats = statSync(filepath)
if (stats.isFile()) {
unlinkSync(filepath)
filesDeleted++
}

} catch (e) {
conn.reply(m.chat, `🌴 Error: ${e.message} (file: ${filepath})`, m)
}})
}})

conn.reply(m.chat, `🪐 Archivos eliminados en tmp: ${filesDeleted}`, m, rcanal)
break
}

case 'cleardb':
case 'cleardatabase':
case 'borrardb':
case 'eliminardb':
case 'borrardatabase': {
conn.reply(m.chat, `🚩 Realizado, ya se ha eliminado la database`, m, rcanal)

const dbFiles = [join(__dirname, '../lib/storage/databaseSV/database.json')]
let deleted = 0

dbFiles.forEach(file => {
if (existsSync(file)) {
unlinkSync(file)
deleted++
}})

conn.reply(m.chat, `🪐 Archivos de base de datos eliminados: ${deleted}`, m, rcanal)
break
}

default:
conn.reply(m.chat, '🚩 *Comando no reconocido*', m, rcanal)
}

} catch (err) {
conn.reply(m.chat, err.message, m, rcanal)
}}

handler.help = ['dsowner', 'cleartmp', 'cleardb']
handler.tags = ['owner']
handler.command = /^(dsowner|delzero|clearallsession|cleartmp|cleardb|cleardatabase|borrardb|eliminardb|borrardatabase)$/i
handler.rowner = true

export default handler