"use client";
import { useState, useEffect, useRef } from "react";

const OPENING =
  "¡Hola! 👋\n\nGracias por comunicarte con Digital Comin.\n\nVoy a hacerte un breve Diagnóstico Digital Gratuito para identificar oportunidades que puedan ayudarte a conseguir más consultas, reservas o ventas.\n\n¿Cómo se llama tu negocio?";

function getTime() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          display: "inline-block", width: 7, height: 7, borderRadius: "50%",
          background: "#aaa",
          animation: `bounce 1.2s ${i * 0.2}s infinite`
        }} />
      ))}
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([{ role: "assistant", content: OPENING, time: getTime() }]);
  const [history, setHistory] = useState([{ role: "assistant", content: OPENING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newHistory = [...history, { role: "user", content: text }];
    setMessages((prev) => [...prev, { role: "user", content: text, time: getTime() }]);
    setHistory(newHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.reply || "No pude procesar eso. ¿Podés intentar de nuevo?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, time: getTime() }]);
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error de conexión. ¿Podés intentar de nuevo?", time: getTime() }]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const S = {
    page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
    card: { width: "100%", maxWidth: 640, background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px rgba(0,0,0,0.10)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: 12 },
    header: { display: "flex", alignItems: "center", gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: "50%", background: "#534AB7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, flexShrink: 0 },
    name: { fontWeight: 600, fontSize: 15, color: "#1a1a2e" },
    status: { fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 5, marginTop: 1 },
    dot: { display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#1D9E75" },
    chatBox: { background: "#f9f9fb", border: "1px solid #ececec", borderRadius: 12, padding: 12, height: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 },
    botBubble: { maxWidth: "82%", alignSelf: "flex-start" },
    userBubble: { maxWidth: "82%", alignSelf: "flex-end" },
    botText: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, borderBottomLeftRadius: 4, padding: "10px 14px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#1a1a1a" },
    userText: { background: "#534AB7", color: "#fff", borderRadius: 14, borderBottomRightRadius: 4, padding: "10px 14px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" },
    time: { fontSize: 11, color: "#9ca3af", marginTop: 3, paddingLeft: 4 },
    timeRight: { fontSize: 11, color: "#9ca3af", marginTop: 3, paddingRight: 4, textAlign: "right" },
    inputRow: { display: "flex", gap: 8 },
    textarea: { flex: 1, fontSize: 14, padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", resize: "none", height: 44, lineHeight: 1.4, outline: "none", fontFamily: "inherit", color: "#1a1a1a" },
    btn: (disabled) => ({ background: disabled ? "#d1d5db" : "#534AB7", color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", height: 44, fontWeight: 500 }),
    divider: { borderTop: "1px solid #f0f0f0", margin: "4px 0" },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.avatar}>DC</div>
          <div>
            <div style={S.name}>Consultor Digital Comin</div>
            <div style={S.status}><span style={S.dot} /> En línea · Diagnóstico Digital Gratuito</div>
          </div>
        </div>
        <div style={S.divider} />
        <div ref={chatRef} style={S.chatBox}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === "assistant" ? S.botBubble : S.userBubble}>
              <div style={msg.role === "assistant" ? S.botText : S.userText}>{msg.content}</div>
              <div style={msg.role === "assistant" ? S.time : S.timeRight}>{msg.time}</div>
            </div>
          ))}
          {loading && (
            <div style={S.botBubble}>
              <div style={S.botText}><TypingDots /></div>
            </div>
          )}
        </div>
        <div style={S.inputRow}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribí tu respuesta..."
            disabled={loading}
            style={S.textarea}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={S.btn(loading || !input.trim())}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
