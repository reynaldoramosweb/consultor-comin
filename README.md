# Consultor Digital Comin

## Setup local

1. Instalar dependencias:
   npm install

2. Crear archivo .env.local con tu API key:
   ANTHROPIC_API_KEY=sk-ant-api03-...

3. Correr en desarrollo:
   npm run dev

4. Abrir http://localhost:3000

## Deploy en Vercel

1. Subir este proyecto a GitHub
2. Ir a vercel.com → New Project → importar el repo
3. En "Environment Variables" agregar:
   - Nombre: ANTHROPIC_API_KEY
   - Valor: tu API key de Anthropic
4. Click en Deploy

La URL pública que genera Vercel ya funciona.
