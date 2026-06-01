# 🏦 Banco Central Arkaios

> **Muestra en tiempo real cómo opera una tesorería modular vigilada por Inteligencia Artificial.**

Banco Central Arkaios es un simulador interactivo de logística financiera y trading que combina una interfaz moderna con un agente de IA integrado. Visualiza flujos de capital, alertas de riesgo y decisiones de tesorería tal como ocurrirían en una institución financiera real — todo en el navegador.

🌐 **Demo en vivo:** [https://ais-pre-otoabiyfcitxdpn6wnqdld-607191134694.us-east1.run.app](https://ais-pre-otoabiyfcitxdpn6wnqdld-607191134694.us-east1.run.app)

---

## ✨ Características principales

- 📊 **Dashboard en tiempo real** — gráficas de posiciones, flujos y métricas de tesorería con Recharts
- 🤖 **IA integrada con Gemini** — el agente analiza el estado del sistema y emite recomendaciones o alertas
- 🧩 **Arquitectura modular** — cada módulo de tesorería opera de forma independiente y observable
- ⚡ **Interfaz reactiva** — construida con React 19, Tailwind CSS y animaciones con Motion
- 🖥️ **Backend Express** — servidor TypeScript que gestiona la comunicación con la API de Gemini

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Estilos | Tailwind CSS v4 |
| Animaciones | Motion (Framer Motion) |
| Gráficas | Recharts |
| Iconos | Lucide React |
| Backend | Express + TypeScript |
| IA | Google Gemini (`@google/genai`) |

---

## 🚀 Instalación y uso local

**Requisitos previos:** Node.js 18+

```bash
# 1. Clona el repositorio
git clone https://github.com/djklmr2025/Banco-Central-Arkaios.git
cd Banco-Central-Arkaios

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env.local
# Edita .env.local y agrega tu GEMINI_API_KEY

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

Obtén tu API key en [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 📁 Estructura del proyecto

```
Banco-Central-Arkaios/
├── src/                  # Código fuente del frontend (React)
├── assets/               # Recursos estáticos y configuración de AI Studio
├── server.ts             # Servidor Express (backend)
├── index.html            # Punto de entrada HTML
├── vite.config.ts        # Configuración de Vite
├── tsconfig.json         # Configuración de TypeScript
├── .env.example          # Plantilla de variables de entorno
└── package.json
```

---

## 📦 Scripts disponibles

```bash
npm run dev     # Inicia servidor de desarrollo (frontend + backend)
npm run build   # Compila para producción
npm run start   # Ejecuta la versión compilada
npm run lint    # Verifica tipos TypeScript
npm run clean   # Limpia archivos de compilación
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar el simulador:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'feat: agrega nueva funcionalidad'`)
4. Abre un Pull Request

---

## 📄 Licencia

Este proyecto fue generado desde la plantilla [google-gemini/aistudio-repository-template](https://github.com/google-gemini/aistudio-repository-template).

---

<div align="center">
  <sub>Construido con ❤️ y Gemini AI · <a href="https://github.com/djklmr2025/Banco-Central-Arkaios">djklmr2025</a></sub>
</div>
