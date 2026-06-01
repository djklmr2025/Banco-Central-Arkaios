import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined or is placeholder. AI actions will run in fallback mock mode.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini SDK:", err);
}

// Fallback logic if Gemini is not configured
const generateFallbackAnalysis = (prices: any) => {
  return `### INFORME DE ANÁLISIS ARKAIOS (FALLBACK)
  * **BTC**: ${prices?.BTC || "N/A"} USD | **ETH**: ${prices?.ETH || "N/A"} USD | **SOL**: ${prices?.SOL || "N/A"} USD | **USDC**: ${prices?.USDC || "N/A"} USD
  * **Análisis de Coyuntura**: El mercado experimenta fluctuaciones moderadas. Se recomienda mantener una postura conservadora de preservación de capital.
  * **Propuesta Arkaios**:
    1. Reservar un 15% de liquidez adicional en USDC para protección anti-volatilidad.
    2. Mantener un colchón robusto en la **Reserva de Emergencia**.
    3. Monitorear retornos de staking de ETH (+4.2% simulación recurrente).`;
};

// API: Get market analysis and recommendations (Fase 1 / Fase 4)
app.post("/api/market-analysis", async (req, res) => {
  const { prices, treasury } = req.body;
  if (!ai) {
    return res.json({ analysis: generateFallbackAnalysis(prices), isMock: true });
  }

  try {
    const prompt = `Actúa como el "Banco Central Autónomo de Arkaios" (MAIN-AMR) para el ecosistema Web3.
    Analiza la situación actual y formula una recomendación formal de gobernanza y tesorería.
    
    INFORMACIÓN DE ENTRADA:
    Precios actuales del mercado:
    - Bitcoin (BTC): $${prices?.BTC}
    - Ethereum (ETH): $${prices?.ETH}
    - Solana (SOL): $${prices?.SOL}
    - USD Coin (USDC): $${prices?.USDC}
    
    Estado de la Tesorería de Arkaios (Fondos Líquidos Totales):
    - Reserva Principal: $${treasury?.reservaPrincipal} USD
    - Reserva de Emergencia: $${treasury?.reservaEmergencia} USD
    - Fondo de Expansión: $${treasury?.fondoExpansion} USD
    - Fondo de IA: $${treasury?.fondoIA} USD
    - Fondo de Liquidez: $${treasury?.fondoLiquidez} USD

    Teniendo en cuenta el rol del Banco Central Autónomo de Arkaios (donde la IA no mueve fondos directamente, sino que propone con prudencia), genera un "Informe Oficial de Estabilidad y Propuesta Monetaria" estructurado en markdown.
    El informe debe contener:
    1. **Resumen Ejecutivo**: Diagnóstico de la distribución actual y la situación del mercado.
    2. **Propuesta Específica**: Una sugerencia de rebalanceo o acción prudente (por ejemplo, mover 1% a ETH para staking simulado, aumentar Fondo de Expansión, acumular USDC para Emergencias, etc.).
    3. **Justificación de Riesgos**: Por qué esta asignación protege el ecosistema, respetando estrictamente que la autonomía debe ser gradual y segura.
    
    Usa un lenguaje formal, profesional, preciso y sobrio (sin jerga exageradamente entusiasta ni emojis innecesarios). Responde en español de forma compacta y legible.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text || generateFallbackAnalysis(prices), isMock: false });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.json({ analysis: generateFallbackAnalysis(prices), isMock: true, error: error.message });
  }
});

// API: Simulate strategy returns (Fase 2)
app.post("/api/simulate-strategy", async (req, res) => {
  const { strategyName, percentage, targetAsset, durationMonths, treasury } = req.body;
  if (!ai) {
    const calculatedReturn = (percentage * 0.05 * (durationMonths / 12)).toFixed(2);
    return res.json({
      report: `### Simulación de Estrategia: ${strategyName} (Fallback)
      * **Activo Objetivo**: ${targetAsset}
      * **Asignación de Tesorería**: ${percentage}%
      * **Duración**: ${durationMonths} meses
      * **Retorno Anualizado Estimado**: +5.1%
      * **Impacto Proyectado**: Se estima una ganancia virtual de +$${calculatedReturn} USD sobre los fondos asignados, asumiendo un riesgo bajo.
      * **Conclusión**: Estrategia viable para simulación de Fase 2. No requiere uso de activos reales.`,
      isMock: true
    });
  }

  try {
    const prompt = `Actúa como el motor analítico del Banco Central de Arkaios (Fase 2 de evolución - Simulación Sólida sin fondos reales).
    Simula e inspecciona la siguiente propuesta de estrategia monetaria:
    - **Nombre de Estrategia**: ${strategyName}
    - **Porcentaje de Tesorería**: ${percentage}% (sobre una Tesorería Total de aprox. $${Object.values(treasury || {}).reduce((a: any, b: any) => a + b, 0)} USD)
    - **Activo Destino**: ${targetAsset}
    - **Duración Proyectada**: ${durationMonths} meses

    Genera una proyección científica simulada (en Markdown).
    Debe calcular:
    1. El retorno proyectado del staking o retornos de liquidez específicos del activo ${targetAsset} en el plazo de ${durationMonths} meses (ej. Staking ETH suele rendir ~4.2% anual, SOL Staking ~6-7% anual, pools DeFi estables ~5-8%).
    2. Un análisis detallado de riesgos: Volatilidad de precio del activo frente a paridad estable, riesgo de smart contracts, o impermanent loss.
    3. Viabilidad de implementar esta simulación en modo Sandbox (Fase 3).
    
    Mantén un tono riguroso, matemático, analítico y profesional en español.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ report: response.text, isMock: false });
  } catch (error: any) {
    console.error("Gemini simulation error:", error);
    res.json({
      report: `Error calling Gemini: ${error.message}. Por favor revisa la clave API.`,
      isMock: true
    });
  }
});

// API: Evaluate Governance Proposal (Fase 4 - Motor de Gobernanza)
app.post("/api/governance-evaluate", async (req, res) => {
  const { proposalTitle, proposalDescription, treasury, limitUSD } = req.body;
  if (!ai) {
    const approve = limitUSD <= 10;
    return res.json({
      verdict: approve ? "APROBADA_MOCK" : "RECHAZADA_MOCK",
      report: `### Evaluación de Gobernanza (Fallback)
      * **Propuesta**: ${proposalTitle}
      * **Decisión Preliminar**: ${approve ? "APROBADO CON CONTROLES (Menor al límite diario)" : "RECHAZADO automáticamente (Excede el límite autónomo seguro de $10 USD/0.1%)"}
      * **Justificación**: En la Fase 4, Arkaios opera bajo estrictas restricciones de seguridad (Límite: $10 USD diarios).`,
      isMock: true
    });
  }

  try {
    const prompt = `Actúa como el Motor de Gobernanza del Banco Central Autónomo de Arkaios.
    Debes auditar y evaluar con rigor la siguiente propuesta de gasto/ejecución pequeña:
    - **Título de la propuesta**: ${proposalTitle}
    - **Descripción**: ${proposalDescription}
    - **Monto de la acción**: ${limitUSD} USD
    - **Límites Regulación actual (Fase 4)**: Límite diario estricto de 10 USD o 0.1% de tesorería (${Object.values(treasury || {}).reduce((a: any, b: any) => a + b, 0) as number * 0.001} USD).
    
    Regla fundamental de Arkaios:
    - Si el monto de la acción supera los 10 USD O supera el 0.1% de la tesorería actual, DEBE ser RECHAZADA inmediatamente por violar los parámetros de autonomía gradual segura de la Fase 4.
    - Si respeta los límites, debe evaluar si la justificación genera valor económico real para el ecosistema (por ejemplo, aportar liquidez al smart contract, tarifas de red, recarga del fondo de IA para llamadas API) o si es especulación. El Banco de Arkaios prioriza el valor orgánico sobre el trading.

    Devuelve un JSON estrictamente estructurado que contenga:
    {
      "verdict": "APROBADA" o "RECHAZADA",
      "reason": "Explicación de una frase de la decisión",
      "report": "Informe detallado en Markdown analizando la propuesta, los límites de riesgo de la Fase 4, la sustentabilidad económica y los controles de aprobación aplicados en Arkaios (máximo 150 palabras)."
    }
    
    Asegúrate de responder únicamente con este objeto JSON, sin envolverlo en bloques markdown decorativos como \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    // Clean potential markdown wrappers
    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "");
    }
    text = text.trim();

    try {
      const parsed = JSON.parse(text);
      res.json({ ...parsed, isMock: false });
    } catch (parseError) {
      console.warn("Could not parse JSON response from Gemini, parsing manual. Raw:", text);
      // Fallback manual parsing if response is raw text
      const verdict = text.includes("APROBADA") ? "APROBADA" : "RECHAZADA";
      res.json({
        verdict,
        reason: "Evaluación procesada por el motor de estabilidad Arkaios.",
        report: text,
        isMock: false
      });
    }
  } catch (error: any) {
    console.error("Governance evaluation error:", error);
    res.json({
      verdict: "RECHAZADA",
      reason: "Error de conexión con el motor de IA.",
      report: `No se pudo evaluar formalmente por un problema en los servicios de IA de Arkaios: ${error.message}`,
      isMock: true
    });
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Banco Central Arkaios Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
