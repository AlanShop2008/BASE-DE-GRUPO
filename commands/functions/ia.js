import 'dotenv/config'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.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
})

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '🤖 Escribe una pregunta.\n\nEjemplo:\n.ia Hola, ¿cómo estás?',
      m
    )
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    const response = await openai.responses.create({
      model: 'gpt-5',
      instructions: `
Eres un asistente inteligente para WhatsApp.
Responde en español.
Sé claro, útil y breve.
`,
      input: text
    })

    const respuesta = response.output_text || 'No pude generar una respuesta.'

    await conn.reply(m.chat, respuesta, m)

  } catch (error) {
    console.error(error)

    await conn.reply(
      m.chat,
      '❌ Error al consultar la inteligencia artificial.',
      m
    )
  }
}

handler.help = ['ia <pregunta>']
handler.tags = ['ai']
handler.command = ['ia']

export default handler
