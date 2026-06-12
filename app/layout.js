export const metadata = {
  title: "Consultor Digital Comin",
  description: "Diagnóstico Digital Gratuito para tu negocio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
