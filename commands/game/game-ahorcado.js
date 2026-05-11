
const palabras = [
    // Tecnología y ciencia
    "computadora", "javascript", "programación", "inteligencia", "robot", "desarrollo", "internet", "algoritmo",
    "servidor", "criptografía", "redes", "software", "hardware", "nanotecnología", "biotecnología", "astronomía",

    // Naturaleza y planeta
    "planeta", "galaxia", "universo", "estrella", "satélite", "ecosistema", "biodiversidad", "evolución",
    "volcán", "terremoto", "huracán", "tsunami", "montaña", "desierto", "bosque", "selva", "océano",
    "río", "lago", "atmósfera", "mariposa", "especie", "fauna", "flora",

    // Historia y cultura
    "historia", "arquitectura", "ingeniería", "faraón", "civilización", "imperio", "revolución", "descubrimiento",
    "museo", "arte", "pintura", "escultura", "filosofía", "literatura", "poesía", "teatro", "mitología",
    "batalla", "guerrero", "castillo", "nobleza",

    // Deportes y entretenimiento
    "fútbol", "tenis", "baloncesto", "natación", "atletismo", "ciclismo", "gimnasia", "boxeo",
    "videojuego", "concierto", "película", "actor", "actriz", "director", "escenario", "musical",

    // Comida y cocina
    "pizza", "hamburguesa", "pasta", "sushi", "tacos", "queso", "chocolate", "helado",
    "panadería", "ingredientes", "receta", "sabores", "especias",

    // Animales y criaturas
    "elefante", "jirafa", "tiburón", "mariposa", "perro", "gato", "águila", "león", "tigre",
    "serpiente", "dragón", "dinosaurio", "fénix", "unicorno",

    // Objetos y cosas comunes
    "lámpara", "reloj", "avión", "automóvil", "bicicleta", "telescopio", "microscopio", "martillo", "espejo",
    "sombrero", "zapato", "libro", "cuaderno"
];

const handler = async (m, { conn}) => {
    const palabra = palabras[Math.floor(Math.random() * palabras.length)];
    const oculta = palabra.replace(/[a-zA-Z]/g, "_");
    let intentos = 6;

    conn.hangmanGame = conn.hangmanGame || {};
    conn.hangmanGame[m.chat] = { palabra, oculta, intentos, letras: []};

    let mensaje = `🎭 *Ahorcado* 🎭\n\n📌 *Palabra:* ${oculta}\n🔹 Intentos restantes: ${intentos}\n📝 Adivina una letra enviando un mensaje con solo una letra.`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.before = async (m, { conn}) => {
    if (conn.hangmanGame && conn.hangmanGame[m.chat]) {
        const juego = conn.hangmanGame[m.chat];
        const letra = m.text.trim().toLowerCase();

        if (letra.length!== 1 ||!/[a-zA-Z]/.test(letra)) {
            return conn.reply(m.chat, "❌ *Envía solo una letra válida.*", m);
}

        if (juego.letras.includes(letra)) {
            return conn.reply(m.chat, "🔁 *Ya has intentado esta letra.*", m);
}

        juego.letras.push(letra);

        if (juego.palabra.includes(letra)) {
            let nuevaOculta = juego.palabra.split("").map(l => (juego.letras.includes(l)? l: "_")).join("");
            juego.oculta = nuevaOculta;
} else {
            juego.intentos -= 1;
}

        if (juego.oculta === juego.palabra) {
            delete conn.hangmanGame[m.chat];
            return conn.reply(m.chat, `🎉 *¡Has ganado!* La palabra era: ${juego.palabra} 🏆`, m);
} else if (juego.intentos === 0) {
            delete conn.hangmanGame[m.chat];
            return conn.reply(m.chat, `💀 *¡Has perdido!* La palabra era: ${juego.palabra}.`, m);
} else {
            return conn.reply(m.chat, `🎭 *Ahorcado* 🎭\n\n📌 *Palabra:* ${juego.oculta}\n🔹 Intentos restantes: ${juego.intentos}\n📝 Adivina otra letra.`, m);
}
}
};
handler.help = ['ahorcado']
handler.tags = ['fun']
handler.command = ["ahorcado"];
export default handler;
