
const handler = async (m) => {
    if (m.text.startsWith('.mamaguevo')) {
        const usuario = m.sender; // Obtener el identificador del usuario

        // Mensaje a enviar
        const mensaje = `💫 *CALCULADORA*\n\n💅🏻 Los cálculos han arrojado que @${usuario} *%* mmgvo 🏳️‍🌈\n> ✰ La Propia Puta Mamando!\n\n➤ ¡Sorpresa!`;

        return m.reply(mensaje);
    }
};
handler.help = ['mamaguevo']
handler.tags = ['fun']
handler.command = /^(mamaguevo)$/i;
export default handler;
