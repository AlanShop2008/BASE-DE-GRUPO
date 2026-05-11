let handler = async (m, { isPrems, conn }) => {
let time = global.db.data.users[m.sender].lastcofre + 0 // 36000000 10 Horas //86400000 24 Horas
if (new Date - global.db.data.users[m.sender].lastcofre < 0) throw `[❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚂𝚃𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚁`

let img = './storage/img/catalogo.png' 
let texto = `𝐆𝐮𝐢𝐚:

𝘌𝘴𝘵𝘢 𝘨𝘶𝘪𝘢 𝘴𝘪𝘳𝘷𝘦 𝘱𝘢𝘳𝘢 𝘲𝘶𝘦 𝘦𝘯𝘵𝘪𝘦𝘯𝘥𝘢𝘯 𝘶𝘯 𝘱𝘰𝘲𝘶𝘪𝘵𝘰 𝘭𝘢𝘴 𝘧𝘶𝘯𝘤𝘪𝘰𝘯𝘦𝘴 𝘥𝘦𝘭 𝘣𝘰𝘵

🧑‍🧑‍🧒‍🧒𝘈𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳𝘦𝘴

1. .𝘰𝘯/𝘰𝘧𝘧 𝘢𝘶𝘥𝘪𝘰𝘴
2. .𝘰𝘯/𝘰𝘧𝘧 𝘮𝘰𝘥𝘰𝘢𝘥𝘮𝘪𝘯 
3. .𝘰𝘯/𝘰𝘧𝘧 𝘣𝘪𝘦𝘯𝘷𝘦𝘯𝘪𝘥𝘢
4. .𝘨𝘳𝘶𝘱𝘰 𝘢𝘣𝘳𝘪𝘳/𝘤𝘦𝘳𝘳𝘢𝘳

🔖𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘤𝘪𝘰𝘯 𝘎𝘳𝘶𝘱𝘰

1. .𝘴𝘦𝘵𝘸𝘦𝘭𝘤𝘰𝘮𝘦 [𝘛𝘦𝘹𝘵𝘰] @𝘶𝘴𝘦𝘳 (𝗘𝗱𝗶𝘁𝗮𝗿 𝗯𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱𝗮)
2. .𝘴𝘦𝘵𝘣𝘺𝘦 [𝘛𝘦𝘹𝘵𝘰] @𝘶𝘴𝘦𝘳 (𝗘𝗱𝗶𝘁𝗮𝗿 𝗱𝗲𝘀𝗽𝗲𝗱𝗶𝗱𝗮)
3. .𝘱𝘳𝘰𝘮𝘰𝘵𝘦 @𝘶𝘴𝘦𝘳 (𝗗𝗮𝗿 𝗮𝗱𝗺𝗶𝗻 𝗮 𝗮𝗹𝗴𝘂𝗶𝗲𝗻)
4. .𝘥𝘦𝘮𝘰𝘵𝘦 @𝘶𝘴𝘦𝘳 (𝗥𝗲𝘁𝗶𝗿𝗮𝗿 𝗮𝗱𝗺𝗶𝗻 𝗮 𝗮𝗹𝗴𝘂𝗶𝗲𝗻)
5. .𝘴𝘦𝘵𝘳𝘦𝘨𝘭𝘢𝘴 [𝘛𝘦𝘹𝘵𝘰] (𝗖𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝗿 𝗿𝗲𝗴𝗹𝗮𝘀 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼) 
6. .𝘬𝘪𝘤𝘬 @𝘶𝘴𝘦𝘳 (𝗘𝗹𝗶𝗺𝗶𝗻𝗮𝗿 𝗮 𝗮𝗹𝗴𝘂𝗶𝗲𝗻 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼)

📍𝘈𝘤𝘤𝘪𝘰𝘯𝘦𝘴

1. .𝘮𝘦𝘯𝘶 (𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀)
2. .𝘥𝘦𝘭 (𝗘𝗹𝗶𝗺𝗶𝗻𝗮𝗿 𝗺𝗲𝗻𝘀𝗮𝗷𝗲 𝗱𝗲 𝗮𝗹𝗴𝘂𝗶𝗲𝗻)
3. .𝘧𝘢𝘯𝘵𝘢𝘴𝘮𝘢𝘴 (𝗟𝗶𝘀𝘁𝗮 𝗱𝗲 𝗶𝗻𝗮𝗰𝘁𝗶𝘃𝗼𝘀)
4. .𝘵𝘰𝘥𝘰𝘴 (𝗠𝗲𝗻𝗰𝗶𝗼𝗻 𝗚𝗲𝗻𝗲𝗿𝗮𝗹 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼)
5. .𝘯 (𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝗿 𝗮 𝘁𝗼𝗱𝗼 𝗲𝗹 𝗴𝗿𝘂𝗽𝗼)
6. .𝘴 (𝗛𝗮𝗰𝗲𝗿 𝘂𝗻 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 𝗿𝗲𝘀𝗽𝗼𝗻𝗱𝗶𝗲𝗻𝗱𝗼 𝗮 𝘂𝗻𝗮 𝗶𝗺𝗮𝗴𝗲𝗻)
7. .𝘱𝘭𝘢𝘺 [𝘊𝘢𝘯𝘤𝘪𝘰𝘯] (𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮 𝗺𝘂𝘀𝗶𝗰𝗮)
8. .𝘱𝘭𝘢𝘺2 [𝘊𝘢𝘯𝘤𝘪𝘰𝘯] (𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮 𝗲𝗹 𝘃𝗶𝗱𝗲𝗼)
9. .𝘦𝘮𝘰𝘵𝘢𝘨 [𝘌𝘮𝘰𝘫𝘪] (𝗖𝗮𝗺𝗯𝗶𝗮 𝗲𝗹 𝗲𝗺𝗼𝗷𝗶 𝗱𝗲𝗹 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 .𝘁𝗼𝗱𝗼𝘀)
10. .setpago [Texto] (𝗘𝗱𝗶𝘁𝗮 𝘁𝘂 𝗺𝗲𝘁𝗼𝗱𝗼 𝗱𝗲 𝗽𝗮𝗴𝗼 𝗲𝗻 𝘁𝘂 𝗴𝗿𝘂𝗽𝗼)
11. .pago (𝗠𝘂𝗲𝘀𝘁𝗿𝗮 𝘁𝘂 𝗺𝗲𝘁𝗼𝗱𝗼 𝗱𝗲 𝗽𝗮𝗴𝗼)
12. .setstock [Texto] (𝗘𝗱𝗶𝘁𝗮 𝗲𝗹 𝘀𝘁𝗼𝗰𝗸 𝗱𝗶𝘀𝗽𝗼𝗻𝗶𝗯𝗹𝗲 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼)
13. .stock (𝗠𝘂𝗲𝘀𝘁𝗿𝗮 𝗲𝗹 𝘀𝘁𝗼𝗰𝗸 𝗱𝗶𝘀𝗽𝗼𝗻𝗶𝗯𝗹𝗲)`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
await conn.sendFile(m.chat, img, 'img.jpg', texto, fkontak)
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.help = ['guía']
handler.tags = ['group']
handler.command = ['guia', 'guía'] 
export default handler
