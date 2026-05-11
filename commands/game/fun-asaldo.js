
const handler = async (m, { conn}) => {
    const estrategias = [
        { nombre: "🔨 Forzar la bóveda", resultado: ["✅ Logras abrir la bóveda y tomar el dinero.", "💀 La alarma suena y la policía llega rápido."]},
        { nombre: "👤 Disfrazarse de empleado", resultado: ["✅ Logras infiltrarte sin ser descubierto.", "❌ Un guardia sospecha de tu identidad y te detienen."]},
        { nombre: "🚗 Planear una rápida huida", resultado: ["✅ Escapas sin dejar rastros.", "💀 Tu coche se avería y quedas atrapado."]},
        { nombre: "🔮 Hackear el sistema de seguridad", resultado: ["✅ Desactivas las alarmas y robas sin problemas.", "❌ La red de seguridad bloquea tu acceso."]},
        { nombre: "💣 Usar explosivos en la puerta", resultado: ["✅ La explosión abre el acceso y tomas el dinero.", "💀 La explosión alerta a todos y eres capturado."]}
    ];

    let mensaje = `💰 *Asalto al Banco* 💰\n\n📌 **Elige tu estrategia para el robo:**\n`;

    estrategias.forEach((estrategia, i) => {
        mensaje += `🔹 ${i + 1}. ${estrategia.nombre}\n`;
});

    mensaje += "\n📌 *Responde con el número de la opción que elijas.*";

    conn.bankHeistGame = conn.bankHeistGame || {};
    conn.bankHeistGame[m.chat] = { estrategias};

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.before = async (m, { conn}) => {
    if (conn.bankHeistGame && conn.bankHeistGame[m.chat]) {
        const eleccion = parseInt(m.text.trim());
        const estrategias = [
            "🔨 Forzar la bóveda", "👤 Disfrazarse de empleado", "🚗 Planear una rápida huida",
            "🔮 Hackear el sistema de seguridad", "💣 Usar explosivos en la puerta"
        ];

        if (eleccion>= 1 && eleccion <= estrategias.length) {
            const estrategiaSeleccionada = estrategias[eleccion - 1];
            const resultado = [
                "✅ Logras abrir la bóveda y tomar el dinero.", "💀 La alarma suena y la policía llega rápido.",
                "✅ Logras infiltrarte sin ser descubierto.", "❌ Un guardia sospecha de tu identidad y te detienen.",
                "✅ Escapas sin dejar rastros.", "💀 Tu coche se avería y quedas atrapado.",
                "✅ Desactivas las alarmas y robas sin problemas.", "❌ La red de seguridad bloquea tu acceso.",
                "✅ La explosión abre el acceso y tomas el dinero.", "💀 La explosión alerta a todos y eres capturado."
            ];

            const desenlace = resultado[Math.floor(Math.random() * resultado.length)];
            let mensajeFinal = `💰 *Asalto al Banco* 💰\n\n👤 *Jugador:* ${conn.getName(m.sender)}\n🔹 *Estrategia:* ${estrategiaSeleccionada}\n\n${desenlace}`;

            conn.sendMessage(m.chat, { text: mensajeFinal});

            delete conn.bankHeistGame[m.chat];
} else {
            await conn.reply(m.chat, "❌ *Opción inválida. Elige un número entre 1 y 5.*", m);
}
}
};
handler.help = ['asalto']
handler.tags = ['fun']
handler.command = ["asalto"];
export default handler;
