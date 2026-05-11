import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.retirado = [
['5215637362813','Antonyxx_',true]
];

/*habrán comandos especiales para los retirados algo q los identifique | nota ustedes pondrán los coamndos y q solo funcione para los retirados*/

// Configuraciones principales
global.rrowner = ['5219617591976']
global.owner = [
   ['5215637362813', 'Antonyxx_', true],
   ['5215637362813', 'Mantenimiento Antonyxx_', true],
   ['62127406624961', 'Antonyxx_ Lid', true],
   ['125018579189775', 'Anthony Lid', true]
   ];

global.mods = ['5215637362813', '5215637362813']
global.suittag = ['5215637362813', '5215637362813']
global.prems = ['5215637362813', '5215637362813', '5215637362813']

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = `[ 𝐒𝐭𝐢𝐜𝐤𝐞𝐫 ɴᴇxxᴏ ʙᴏᴛ]`
global.author = '[ ɴᴇxxᴏ ʙᴏᴛ ]'
global.stickpack = ' ɴᴇxxᴏ ʙᴏᴛ '
global.stickauth = ' ɴᴇxxᴏ ʙᴏᴛ  '
global.wm = 'ɴᴇxxᴏ ʙᴏᴛ '
global.dev = 'ɴᴇxxᴏ ʙᴏᴛ '
global.wait = '*𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫 𝐚𝐠𝐮𝐚𝐫𝐝𝐞 𝐮𝐧 𝐦𝐨𝐦𝐞𝐧𝐭𝐨\n\n> ɴᴇxxᴏ ʙᴏᴛ *'
global.botname = '[  ɴᴇxxᴏ ʙᴏᴛ  ]'
global.textbot = `𝐓𝐞𝐜𝐧𝐨𝐥𝐨𝐠𝐢𝐬 ɴᴇxxᴏ ʙᴏᴛ `
global.prefijo = ''
global.vs = '2.7.0'
global.dev = '𝐒𝐨𝐟𝐭𝐰𝐚𝐫𝐞 ɴᴇxxᴏ ʙᴏᴛ '
global.listo = '*𝐄𝐱𝐢𝐭𝐨*'
global.namechannel = 'ɴᴇxxᴏ ʙᴏᴛ '
global.channel = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./storage/img/catalogo.png')
global.miniurl = fs.readFileSync('./storage/img/miniurl.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'
global.canal = 'https://whatsapp.com/channel/0029Vb6H03G0lwgniEyDBx3a'
global.insta = 'https://instagram.com/karlyalan_2404'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./storage/img/catalogo.png');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}

global.ch = {
ch1:'120363403726798403@newsletter'
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.Sesion = 'sessions'
global.dbname = 'database.json'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//Apis

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
pencarikode: 'https://pencarikode.xyz',
Velgrynd: 'https://velgrynd.herokuapp.com',
rey: 'https://server-api-rey.herokuapp.com',
hardianto: 'http://hardianto-chan.herokuapp.com',
shadow: 'https://api.reysekha.xyz',
apialc: 'https://api-alc.herokuapp.com',
botstyle: 'https://botstyle-api.herokuapp.com',
neoxr: 'https://neoxr-api.herokuapp.com',
ana: 'https://anabotofc.herokuapp.com/',
kanx: 'https://kannxapi.herokuapp.com/',
dhnjing: 'https://dhnjing.xyz'
},

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

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
