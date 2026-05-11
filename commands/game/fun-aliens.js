
const handler = async (m, { conn}) => {
    const situaciones = [
        { nombre: "🛸 Contacto alienígena", reto: "Un grupo de extraterrestres dice querer ayudar, ¿confías en ellos o sospechas de un engaño?"},
        { nombre: "🕵️‍♂️ Infiltrados humanos", reto: "Descubre si hay alienígenas disfrazados entre los líderes militares."},
        { nombre: "⚔️ Alianza inesperada", reto: "Un comandante alien quiere negociar un pacto de paz. ¿Aceptas o preparas un ataque?"},
        { nombre: "🔮 Tecnología oculta", reto: "Los extraterrestres te ofrecen acceso a su tecnología avanzada, pero con un precio... ¿Lo aceptas?"},
        { nombre: "💣 Traición en el campo de batalla", reto: "Tus propios soldados comienzan a actuar extraño… ¿Serán manipulados por los extraterrestres?"}
    ];

    let mensaje = `👽 *Aliados y Traidores* 🕵️‍♂️🚀\n\n📌 **Elige tu situación:**\n`;

    situaciones.forEach((evento, i) => {
        mensaje += `🔹 ${i + 1}. ${evento.nombre} - ${evento.reto}\n`;
});

    mensaje += "\n📌 *Responde con el número de la opción que elijas.*";

    conn.traitorGame = conn.traitorGame || {};
    conn.traitorGame[m.chat] = {};

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.before = async (m, { conn}) => {
    if (conn.traitorGame && conn.traitorGame[m.chat]) {
        const eleccion = parseInt(m.text.trim());
        const situaciones = [
            "🛸 Contacto alienígena", "🕵️‍♂️ Infiltrados humanos", "⚔️ Alianza inesperada",
            "🔮 Tecnología oculta", "💣 Traición en el campo de batalla"
        ];

        if (eleccion>= 1 && eleccion <= situaciones.length) {
            const eventoSeleccionado = situaciones[eleccion - 1];
            const usuario = conn.getName(m.sender);
            conn.traitorGame[m.chat] = { nombre: usuario, evento: eventoSeleccionado};

            await conn.reply(m.chat, `✅ *${usuario} ha elegido:* ${eventoSeleccionado}\n⌛ Preparándose para la decisión más difícil...`, m);

            setTimeout(() => {
                const resultado = [
                    "🏆 ¡Tomaste la mejor decisión y tu equipo confía plenamente en ti!",
                    "💀 Fuiste engañado y los alienígenas han tomado el control de la base.",
                    "⚔️ Lograste negociar la paz, pero aún hay dudas entre los humanos.",
                    "🔥 Obtuviste tecnología avanzada, pero ahora los extraterrestres tienen influencia sobre tu ejército.",
                    "💢 Descubriste al traidor, pero ya causó daños irreparables."
                ];
                const desenlace = resultado[Math.floor(Math.random() * resultado.length)];

                let mensajeFinal = `👽 *Aliados y Traidores* 🕵️‍♂️🚀\n\n👤 *Jugador:* ${usuario}\n🛸 *Situación:* ${eventoSeleccionado}\n\n${desenlace}`;

                conn.sendMessage(m.chat, { text: mensajeFinal});

                delete conn.traitorGame[m.chat];
}, 5000);
} else {
            await conn.reply(m.chat, "❌ *Opción inválida. Elige un número entre 1 y 5.*", m);
}
}
};

handler.help = ['aliens']
handler.tags = ['fun']
handler.command = ["aliens"];
export default handler;
