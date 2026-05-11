
const handler = async (m, { conn}) => {
    const autos = ["🏎️ Ferrari", "🚗 Mustang", "🚙 Jeep", "🚕 Taxi", "🚚 Camión", "🚓 Policía", "🛻 Pick-Up", "🚜 Tractor"];
    let jugadores = {};
    let mensajeInicial = `🚦 *Carrera de Autos* 🚦\n\n📌 **Elige tu auto:**\n`;

    autos.forEach((auto, i) => {
        mensajeInicial += `🔹 ${i + 1}. ${auto}\n`;
});

    mensajeInicial += "\n📌 *Responde con el número del auto que quieres para participar.*";

    conn.raceGame = conn.raceGame || {};
    conn.raceGame[m.chat] = { jugadores};

    await conn.sendMessage(m.chat, { text: mensajeInicial});
};

handler.before = async (m, { conn}) => {
    if (conn.raceGame && conn.raceGame[m.chat]) {
        const eleccion = parseInt(m.text.trim());
        const autos = ["🏎️ Ferrari", "🚗 Mustang", "🚙 Jeep", "🚕 Taxi", "🚚 Camión", "🚓 Policía", "🛻 Pick-Up", "🚜 Tractor"];

        if (eleccion>= 1 && eleccion <= autos.length) {
            const autoSeleccionado = autos[eleccion - 1];
            const usuario = conn.getName(m.sender); // Obtener el nombre del usuario

            conn.raceGame[m.chat].jugadores[m.sender] = { nombre: usuario, auto: autoSeleccionado};

            await conn.reply(m.chat, `✅ *${usuario} ha elegido:* ${autoSeleccionado}\n⌛ Esperando más jugadores...`, m);

            setTimeout(() => {
                if (Object.keys(conn.raceGame[m.chat].jugadores).length> 1) {
                    const participantes = Object.values(conn.raceGame[m.chat].jugadores);
                    const ganador = participantes[Math.floor(Math.random() * participantes.length)];

                    let mensajeCarrera = "🏁 *La carrera comienza...*\n\n";
                    participantes.forEach(({ nombre, auto}) => {
                        mensajeCarrera += `👤 ${nombre}: ${auto}\n`;
});

                    mensajeCarrera += `\n🎉 *El ganador es:* ${ganador.nombre} con ${ganador.auto} 🏆`;

                    conn.sendMessage(m.chat, { text: mensajeCarrera});
} else {
                    conn.sendMessage(m.chat, { text: "❌ *No hubo suficientes jugadores para iniciar la carrera.*"});
}

                delete conn.raceGame[m.chat];
}, 10000);
} else {
            await conn.reply(m.chat, "❌ *Opción inválida. Elige un número entre 1 y 8.*", m);
}
}
};

handler.help = ['carrera']
handler.tags = ['rpg']
handler.command = ["carrera"];
export default handler;
