
const handler = async (m, { conn}) => {
    const casos = [
        {
            descripcion: "🔎 *Caso: El robo del diamante azul.*\n💎 Se ha robado un diamante valioso en una galería de arte. Hay tres sospechosos: un guardia de seguridad, un turista y el dueño del museo.",
            opciones: ["Interrogar al guardia", "Revisar las cámaras de seguridad", "Examinar la escena del crimen"],
            respuestaCorrecta: 1,
            resultado: ["❌ El guardia niega saber nada, pero su coartada es sospechosa.", "✅ Revisas las cámaras y ves que el dueño del museo escondió el diamante.", "❌ Encuentras huellas, pero no están claras."]
},
        {
            descripcion: "🔎 *Caso: Misterioso accidente de coche.*\n🚗 Un vehículo apareció destrozado en un callejón. Se sospecha de un conductor imprudente o un intento de escape.",
            opciones: ["Buscar testigos", "Revisar el vehículo", "Analizar el tráfico cercano"],
            respuestaCorrecta: 2,
            resultado: ["❌ Un testigo dice que vio algo, pero su historia no es confiable.", "❌ Revisas el vehículo y solo encuentras marcas de frenado.", "✅ Analizando el tráfico, descubres que el auto estaba siendo perseguido por un sospechoso."]
},
        {
            descripcion: "🔎 *Caso: Desaparición en el hotel.*\n🏨 Un huésped ha desaparecido misteriosamente en su habitación sin dejar rastro.",
            opciones: ["Revisar el baño", "Interrogar al recepcionista", "Buscar objetos personales"],
            respuestaCorrecta: 0,
            resultado: ["✅ Encuentras una pista en el baño: la ventana está rota, alguien escapó por ahí.", "❌ El recepcionista no vio nada extraño.", "❌ El cuarto está ordenado, pero no hay pistas útiles."]
}
    ];

    const casoSeleccionado = casos[Math.floor(Math.random() * casos.length)];

    let mensaje = `🕵️‍♂️ *Modo Detective* 🕵️‍♂️\n\n${casoSeleccionado.descripcion}\n\n`;
    casoSeleccionado.opciones.forEach((opcion, i) => {
        mensaje += `🔹 ${i + 1}. ${opcion}\n`;
});

    mensaje += "\n📌 *Responde con el número de la acción que deseas tomar.*";

    conn.detectiveGame = conn.detectiveGame || {};
    conn.detectiveGame[m.chat] = {
        respuestaCorrecta: casoSeleccionado.respuestaCorrecta,
        resultado: casoSeleccionado.resultado
};

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.before = async (m, { conn}) => {
    if (conn.detectiveGame && conn.detectiveGame[m.chat]) {
        const respuesta = parseInt(m.text.trim());
        const { respuestaCorrecta, resultado} = conn.detectiveGame[m.chat];

        if (respuesta>= 1 && respuesta <= resultado.length) {
            delete conn.detectiveGame[m.chat];
            return conn.reply(m.chat, resultado[respuesta - 1], m);
} else {
            return conn.reply(m.chat, `❌ *Opción no válida. Intenta con un número entre 1 y ${resultado.length}.*`, m);
}
}
};
handler.help = ['detective']
handler.tags = ['rpg']
handler.command = ["detective"];
export default handler;
