import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // tu clave de OpenAI
});

const handler = async (m, { conn, text }) => {
  try {
    if (!text) return conn.reply(m.chat, "> ✖ Ingresa tu pregunta después del comando", m);

    await m.react("⏳");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: text }],
    });

    const answer = response.choices[0].message.content;

    await conn.reply(m.chat, `💬 IA dice:\n\n${answer}`, m);

    await m.react("✔️");

  } catch (e) {
    console.error(e);
    await m.react("✖");
    conn.reply(m.chat, `> ⚠ ERROR: ${e.message || e}`, m);
  }
};

handler.command = ["ia", "chat"];
handler.help = ["ia <pregunta>"];
handler.tags = ["main"];

export default handler;
