const adivinanzas = [
    {
        pregunta: "Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.",
        respuesta: "pera",
        pista: "Es una fruta muy común en jugos y postres."
    },
    {
        pregunta: "Oro parece, plata no es. Quien no lo adivine, bien tonto es.",
        respuesta: "platano",
        pista: "Es una fruta amarilla y dulce."
    },
    {
        pregunta: "Cuanto más me quitas, más grande soy. ¿Qué soy?",
        respuesta: "agujero",
        pista: "Lo encuentras en el queso o en la ropa vieja."
    },
    {
        pregunta: "Tengo agujas pero no sé coser, tengo números y no sé leer.",
        respuesta: "reloj",
        pista: "Lo miras cuando quieres saber la hora."
    },
    {
        pregunta: "Sube llena y baja vacía, si no se da prisa la sopa se enfría.",
        respuesta: "cuchara",
        pista: "La usas para comer sopa."
    },
    {
        pregunta: "Vuelo sin alas, lloro sin ojos. Siempre que voy, regreso.",
        respuesta: "nube",
        pista: "La ves en el cielo y a veces trae lluvia."
    },
    {
        pregunta: "Agua pasa por mi casa, cate de mi corazón. ¿Qué soy?",
        respuesta: "aguacate",
        pista: "Fruta verde muy popular en México."
    },
    {
        pregunta: "En la torre nací, en la torre moriré, nunca saldré de la torre, y la torre romperé.",
        respuesta: "campana",
        pista: "Suena fuerte en las iglesias."
    },
    {
        pregunta: "Tengo dientes y no muerdo, tengo cabeza y no soy persona.",
        respuesta: "ajo",
        pista: "Ingrediente muy usado en la cocina."
    },
    {
        pregunta: "Sin ser ave, tengo plumas. Sin ser pez, sé nadar. ¿Qué soy?",
        respuesta: "pato",
        pista: "Animal que vive en lagos y charcas."
    },
    {
        pregunta: "Largo o corto puedo ser, duro o blando también. Y en la cama siempre estoy. ¿Qué soy?",
        respuesta: "colchon",
        pista: "Lo usas para dormir cómodo."
    },
    {
        pregunta: "Me ves en el agua, pero no soy pez. Vuelo en el aire, pero no soy ave.",
        respuesta: "reflejo",
        pista: "Lo ves en espejos y superficies brillantes."
    },
    {
        pregunta: "Cuatro patas tengo y no puedo correr, doy leche a los niños y también de comer.",
        respuesta: "vaca",
        pista: "Animal de granja muy conocido."
    },
    {
        pregunta: "Tengo alas y pico, pero no soy avión. Doy huevos y canto en el corral.",
        respuesta: "gallina",
        pista: "Animal doméstico que vive en el corral."
    },
    {
        pregunta: "Sin ser humano hablo, sin tener boca canto, y todos me escuchan cuando estoy sonando.",
        respuesta: "radio",
        pista: "Lo enciendes para escuchar música o noticias."
    }
];


const puntos = {};

const handler = async (m, { conn }) => {
    const random = adivinanzas[Math.floor(Math.random() * adivinanzas.length)];
    conn.adivinanzaGame = conn.adivinanzaGame || {};
    conn.adivinanzaGame[m.chat] = { ...random, intentos: 0 };

    let mensaje = `🎭 *Adivinanza* 🎭\n\n🤔 ${random.pregunta}\n\n📝 Envía tu respuesta en un mensaje.`;
    await conn.sendMessage(m.chat, { text: mensaje });
};

handler.before = async (m, { conn }) => {
    if (conn.adivinanzaGame && conn.adivinanzaGame[m.chat]) {
        const juego = conn.adivinanzaGame[m.chat];
        const respuestaUsuario = m.text.trim().toLowerCase();
        juego.intentos++;

        if (respuestaUsuario === juego.respuesta) {
            const userId = m.sender;
            puntos[userId] = (puntos[userId] || 0) + 1;

            delete conn.adivinanzaGame[m.chat];
            return conn.reply(m.chat, `🎉 ¡Correcto! La respuesta era *${juego.respuesta}* 🏆\n⭐ Tus puntos: ${puntos[userId]}`, m);
        } else {
            if (juego.intentos >= 2) {
                return conn.reply(m.chat, `❌ No es correcto. Pista: ${juego.pista}`, m);
            } else {
                return conn.reply(m.chat, "❌ No es correcto, intenta otra vez.", m);
            }
        }
    }
};

handler.help = ['adivinanza'];
handler.tags = ['fun'];
handler.command = ["adivinanza"];
export default handler;
