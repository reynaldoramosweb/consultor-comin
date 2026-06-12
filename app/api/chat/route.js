export async function POST(request) {
  try {
    const { messages } = await request.json();

    const firstUserIndex = messages.findIndex(m => m.role === "user");
    const cleanMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;

    const contents = cleanMessages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `Eres un Consultor Virtual de Marketing Digital de Digital Comin. Hacé UNA pregunta por mensaje. Sé breve, empático y profesional. Nunca vendas ni menciones precios. Recopilá info del negocio progresivamente: nombre, ciudad, rubro, servicios, redes sociales, web, publicidad, consultas mensuales, ventas. Cuando tengas suficiente info, generá un diagnóstico con fortalezas, oportunidades, recomendaciones y puntuación /100.` }]
        },
        contents,
        generationConfig: { maxOutputTokens: 800 }
      })
    });

    const data = await res.json();
    console.log("GEMINI:", JSON.stringify(data).slice(0, 300));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error("Sin respuesta de Gemini:", JSON.stringify(data));
      return Response.json({ reply: "No pude procesar eso. ¿Podés intentar de nuevo?" });
    }
    return Response.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
