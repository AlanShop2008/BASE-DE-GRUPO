import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = m => m
handler.before = async function (m, { conn }) {
    if (!m.messageStubType || !m.isGroup) return true;

    let chat = global.db.data.chats[m.chat];
    if (!chat.welcome) return true;

    let rawParam = m.messageStubParameters[0];
    let userId;
    try {
        const parsed = JSON.parse(rawParam);
        userId = parsed.phoneNumber || parsed.id;
    } catch {
        userId = rawParam;
    }

    if (!userId) return true; 

    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (e) {
        return true;
    }
    const desc = groupMetadata.desc || 'Sin descripción';
    const groupName = groupMetadata.subject;
    const membersCount = groupMetadata.participants.length; 
    
    const mentionId = userId.split('@')[0];
    const mentionsList = [userId]; 
    const user = `@${mentionId}`;

    const welcomeImageUrl = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://i.pinimg.com/236x/ab/01/43/ab01437a16fdf57072342eb1a9bc303a.jpg')
    const goodbyeImageUrl = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://i.pinimg.com/236x/ab/01/43/ab01437a16fdf57072342eb1a9bc303a.jpg')
    
    let groupName2 = await conn.getName(m.chat)
    let ppUrl
    try {
      ppUrl = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      ppUrl = 'https://telegra.ph/file/24fa902eadfea1e1e0ee3.png' 
    }

    const fgrupo = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        id: "Undefined"
      },
      message: {
        locationMessage: {
          name: groupName2, 
          jpegThumbnail: ppUrl ? await (await fetch(ppUrl)).buffer() : null
        }
      }
    }

    if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const finalCount = membersCount + 1; 
        
        let welcomeText = chat.sWelcome
            ? chat.sWelcome.replace(/@user/g, user) 
            .replace(/@conteo/g, membersCount)
            : `✨ *¡Bienvenido/a a ${groupName}!* ✨\n\n👋 Hola, ${user}!\n🎉 Ahora somos *${finalCount}* miembros.\n📜 Por favor, lee la descripción y respeta las normas.\n\n${desc}`;

        await conn.sendMessage(m.chat, {
            image: { url: welcomeImageUrl },
            caption: welcomeText,
            mentions: mentionsList
        }, { quoted: fgrupo });
      
        await conn.sendMessage(m.chat, {
            audio: { url: "https://www.dropbox.com/scl/fi/io88ss24wav4r2rhcj8wp/WhatsApp-Audio-2026-02-19-at-5.05.26-PM.mpeg?rlkey=bzdvs03eilok4n092iqzasura&st=lj8ahzth&dl=1" },
            mimetype: 'audio/mpeg',
        }, { quoted: fgrupo });
    }

    if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
        const finalCount = membersCount - 1; 

        let goodbyeText = chat.sBye
            ? chat.sBye.replace(/@user/g, user) 
            : `👋 *¡Adiós, ${user}!* 👋\n\n📉 El grupo *${groupName}* pierde a un miembro.\n🕊️ Ahora somos *${finalCount}* miembros.\n\nEsperamos verte pronto!`;

        await conn.sendMessage(m.chat, {
            image: { url: goodbyeImageUrl },
            caption: goodbyeText,
            mentions: mentionsList
        }, { quoted: fgrupo });
    }
    
    return true; 
};

handler.group = true; 
export default handler;
