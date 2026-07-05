import { watchFile, unwatchFile } from 'fs'
import fs from 'fs'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'

// ===============================
// CONFIGURACIÓN DEL DUEÑO
// ===============================

const OWNER_NUM = '5217715555998'
const OWNER_LID = '82816314421258'
const OWNER_NAME = 'ALAN_SHOP'

// ===============================
// Configuración automática
// ===============================

global.retirado = [
  [OWNER_NUM, OWNER_NAME, true]
]

global.rrowner = [OWNER_NUM]

global.owner = [
  [OWNER_NUM, OWNER_NAME, true],
  [OWNER_LID, `${OWNER_NAME} Lid`, true]
]

global.mods = [OWNER_NUM]
global.suittag = [OWNER_NUM]
global.prems = [OWNER_NUM]

// ===============================
// DATOS DEL BOT
// ===============================

global.packname = `[ 𝐒𝐭𝐢𝐜𝐤𝐞𝐫 ɴᴇxxᴏ ʙᴏᴛ ]`
global.author = '[ ɴᴇxxᴏ ʙᴏᴛ ]'
global.stickpack = 'ɴᴇxxᴏ ʙᴏᴛ'
global.stickauth = 'ɴᴇxxᴏ ʙᴏᴛ'
global.wm = 'ɴᴇxxᴏ ʙᴏᴛ'
global.dev = '𝐒𝐨𝐟𝐭𝐰𝐚𝐫𝐞 ɴᴇxxᴏ ʙᴏᴛ'
global.wait = '*𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫 𝐚𝐠𝐮𝐚𝐫𝐝𝐞 𝐮𝐧 𝐦𝐨𝐦𝐞𝐧𝐭𝐨\n\n> ɴᴇxxᴏ ʙᴏᴛ *'
global.botname = '[ ɴᴇxxᴏ ʙᴏᴛ ]'
global.textbot = `𝐓𝐞𝐜𝐧𝐨𝐥𝐨𝐠𝐢𝐬 ɴᴇxxᴏ ʙᴏᴛ`
global.prefijo = ''
global.vs = '2.7.0'
global.listo = '*𝐄𝐱𝐢𝐭𝐨*'
global.namechannel = 'ɴᴇxxᴏ ʙᴏᴛ'
global.channel = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'

// ===============================
// IMÁGENES
// ===============================

global.catalogo = fs.existsSync('./storage/img/catalogo.png')
  ? fs.readFileSync('./storage/img/catalogo.png')
  : null

global.miniurl = fs.existsSync('./storage/img/miniurl.jpg')
  ? fs.readFileSync('./storage/img/miniurl.jpg')
  : null

// ===============================
// REDES
// ===============================

global.group = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'
global.canal = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'
global.insta = 'https://instagram.com/karlyalan_2404'

// ===============================
// ESTILO
// ===============================

global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    ...(false ? { remoteJid: '5219992095479-1625305606@g.us' } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: global.packname,
      orderTitle: 'Bang',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

global.ch = {
  ch1: '120363403726798403@newsletter'
}

// ===============================
// LIBRERÍAS GLOBALES
// ===============================

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.Sesion = 'sessions'
global.dbname = 'database.json'

// ===============================
// CONFIG EXTRA
// ===============================

global.multiplier = 69
global.maxwarn = '2'

// ===============================
// APIS
// ===============================

global.APIs = {
  amel: 'https://melcanz.com',
  bx: 'https://bx-hunter.herokuapp.com',
  nrtm: 'https://nurutomo.herokuapp.com',
  xteam: 'https://api.xteam.xyz',
  nzcha: 'http://nzcha-apii.herokuapp.com',
  bg: 'http://bochil.ddns.net',
  fdci: 'https://api.fdci.se',
  dzx: 'https://api.dhamzxploit.my.id',
  bsbt: 'https://bsbt-api-rest.herokuapp.com',
  zahir: 'https://zahirr-web.herokuapp.com',
  zeks: 'https://api.zeks.me',
  hardianto: 'https://hardianto-chan.herokuapp.com',
  pencarikode: 'https://pencarikode.xyz',
  LeysCoder: 'https://leyscoders-api.herokuapp.com',
  adiisus: 'https://adiixyzapi.herokuapp.com',
  lol: 'https://api.lolhuman.xyz',
  fgmods: 'https://api-fgmods.ddns.net',
  Velgrynd: 'https://velgrynd.herokuapp.com',
  rey: 'https://server-api-rey.herokuapp.com',
  shadow: 'https://api.reysekha.xyz',
  apialc: 'https://api-alc.herokuapp.com',
  botstyle: 'https://botstyle-api.herokuapp.com',
  neoxr: 'https://neoxr-api.herokuapp.com',
  ana: 'https://anabotofc.herokuapp.com/',
  kanx: 'https://kannxapi.herokuapp.com/',
  dhnjing: 'https://dhnjing.xyz'
}

global.APIKeys = {
  'https://api-alc.herokuapp.com': 'ConfuMods',
  'https://api.reysekha.xyz': 'apirey',
  'https://melcanz.com': 'F3bOrWzY',
  'https://bx-hunter.herokuapp.com': 'Ikyy69',
  'https://api.xteam.xyz': '5bd33b276d41d6b4',
  'https://zahirr-web.herokuapp.com': 'zahirgans',
  'https://bsbt-api-rest.herokuapp.com': 'benniismael',
  'https://api.zeks.me': 'apivinz',
  'https://hardianto-chan.herokuapp.com': 'hardianto',
  'https://pencarikode.xyz': 'pais',
  'https://api-fgmods.ddns.net': 'fg-dylux',
  'https://leyscoders-api.herokuapp.com': 'MIMINGANZ',
  'https://server-api-rey.herokuapp.com': 'apirey',
  'https://api.lolhuman.xyz': 'GataDiosV2',
  'https://botstyle-api.herokuapp.com': 'Eyar749L',
  'https://neoxr-api.herokuapp.com': 'yntkts',
  'https://anabotofc.herokuapp.com/': 'AnaBot'
}

// ===============================
// AUTO RECARGA CONFIG
// ===============================

const file = fileURLToPath(import.meta.url)

watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
