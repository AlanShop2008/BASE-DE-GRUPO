async function initPersonalizacion() {
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  const defaultBotData = {
    Botname: 'ɴᴇxxᴏ ʙᴏᴛ',
    TextBot: 'ɴᴇxxᴏ ʙᴏᴛ',
    shortname: 'ɴᴇxxᴏ ʙᴏᴛ',
    currency: 'Coins',
    banner: 'https://raw.githubusercontent.com/WillZek/Kitty-Storage/main/image/1771466831407-a7b13a15.jpg',
    icon1: 'https://raw.githubusercontent.com/WillZek/Kitty-Storage/main/image/1771466831407-a7b13a15.jpg',
    icon2: 'https://raw.githubusercontent.com//KittyWillZek-Storage/main/image/1771466831407-a7b13a15.jpg'
  }

  while (!global.db?.data) await new Promise(resolve => setTimeout(resolve, 50))
  
  const chatId = global.chatId
  const jid = global.conn?.user?.jid || 'main'
  if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}

  const botData = global.db.data.chats[chatId]

  botData.Botname = botData.Botname || defaultBotData.Botname
  botData.TextBot = botData.TextBot || defaultBotData.TextBot
  botData.shortname = botData.shortname || defaultBotData.shortname
  botData.currency = botData.currency || defaultBotData.currency
  botData.banner = botData.banner || defaultBotData.banner
  botData.icon1 = botData.icon1 || defaultBotData.icon1
  botData.icon2 = botData.icon2 || defaultBotData.icon2

  global.botname = botData.Botname
  global.textbot = botData.TextBot
  global.shortname = botData.shortname
  global.currency = botData.currency
  global.banner = botData.banner
  global.iconimg1 = botData.icon1
  global.iconimg2 = botData.icon2
  global.icons = pickRandom([global.iconimg1, global.iconimg2])
  global.channelnam = global.botname

  const redesList = [
    'https://www.facebook.com/profile.php?id=61574203539793',
    'https://github.com/Antonyxit/sexolapelicula',
    'https://crowbot-web.vercel.app/',
    'https://www.instagram.com/antonyx_444',
  ]
  global.redes = pickRandom(redesList)

  Object.assign(globalThis, {
    botname: global.botname,
    textbot: global.textbot,
    shortname: global.shortname,
    currency: global.currency,
    banner: global.banner,
    iconimg1: global.iconimg1,
    iconimg2: global.iconimg2,
    icons: global.icons,
    channelnam: global.channelnam,
    redes: global.redes
  })
}

export default initPersonalizacion
