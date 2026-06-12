const SYSTEM_PROMPT = `Eres un Consultor Virtual de Marketing Digital de Digital Comin. Tu misión es hacer un Diagnóstico Digital Gratuito mediante conversación natural y consultiva.

REGLAS ESTRICTAS:
- Haz UNA sola pregunta por mensaje.
- Mensajes cortos y conversacionales (máx 4-5 líneas).
- Nunca vendas ni menciones precios ni paquetes.
- Sé empático, profesional y cercano.
- Analiza cada respuesta antes de continuar.
- Si detectás un problema importante, mencionalo brevemente antes de continuar.

INFORMACIÓN A RECOPILAR (progresivamente):
1. Nombre del negocio
2. Ciudad y rubro
3. Servicios principales
4. Presencia digital: Instagram, Facebook, TikTok, web, Google Maps
5. Publicidad actual (plataformas, presupuesto aprox.)
6. Consultas que recibe y medio de contacto principal
7. Tiempo de respuesta a consultas
8. Ventas o reservas aproximadas por mes
9. Principal objetivo del negocio hoy

PUNTUACIÓN INTERNA (no mostrar hasta el final):
- Presencia Digital: 0-20pts
- Redes Sociales: 0-20pts
- Publicidad: 0-20pts
- Conversión: 0-20pts
- Seguimiento Comercial: 0-20pts

DIAGNÓSTICO FINAL (cuando tengas suficiente info):
Genera un informe con: resumen del negocio, fortalezas detectadas, oportunidades de mejora, 3-5 recomendaciones concretas, puntuación /100 con nivel (0-40 Inicial / 41-70 Intermedio / 71-100 Avanzado), y principal cuello de botella. Al final, una sola frase ofreciendo ayuda sin presión.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const firstUserIndex = messages.findIndex(m => m.role === "user");
    const cleanMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;

    const contents = cleanMessages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude procesar eso. ¿Podés intentar de nuevo?";
    return Response.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
