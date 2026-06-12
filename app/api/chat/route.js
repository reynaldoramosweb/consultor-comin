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
        system_instruction: { parts: [{ text: "Eres un consultor de marketing digital. Haz UNA pregunta por mensaje. Sé breve y amigable." }] },
        contents,
        generationConfig: { maxOutputTokens: 800 }
      })
    });
    const data = await res.json();
    console.log("GEMINI OK:", JSON.stringify(data).slice(0, 400));
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta";
    return Response.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.message);
    return Response.json({ reply: "Error: " + error.message });
  }
}
