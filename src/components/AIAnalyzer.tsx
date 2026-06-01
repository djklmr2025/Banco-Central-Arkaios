import { useState, useEffect } from "react";
import { MarketPrices, Treasury } from "../types";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { Copy, Eye, Landmark, Loader2, Sparkles, RefreshCw, Layers } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface AIAnalyzerProps {
  prices: MarketPrices;
  treasury: Treasury;
  onRefreshPrices: () => void;
}

export default function AIAnalyzer({ prices, treasury, onRefreshPrices }: AIAnalyzerProps) {
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Generate some dummy historical data for the visual sparklines
  useEffect(() => {
    const data = [];
    let btcBase = prices.BTC * 0.95;
    let ethBase = prices.ETH * 0.96;
    let solBase = prices.SOL * 0.94;
    
    for (let i = 0; i < 8; i++) {
      data.push({
        num: i,
        BTC: btcBase + Math.random() * (prices.BTC * 0.05),
        ETH: ethBase + Math.random() * (prices.ETH * 0.04),
        SOL: solBase + Math.random() * (prices.SOL * 0.06),
      });
    }
    // Add current prices
    data.push({
      num: 8,
      BTC: prices.BTC,
      ETH: prices.ETH,
      SOL: prices.SOL,
    });
    setHistoricalData(data);
  }, [prices]);

  const requestAIReport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices, treasury }),
      });
      const data = await response.json();
      setAnalysisReport(data.analysis);
    } catch (error) {
      console.error("Error fetching AI report:", error);
      setAnalysisReport(
        "Fallo de conexión. Por favor verifica que el servidor se encuentre activo y la clave de API de Gemini esté ingresada correctamente en Settings > Secrets."
      );
    } finally {
      setLoading(false);
    }
  };

  const tokens = [
    { name: "Bitcoin", symbol: "BTC", price: prices.BTC, dataKey: "BTC", color: "#f7931a", desc: "Digital gold reserve asset." },
    { name: "Ethereum", symbol: "ETH", price: prices.ETH, dataKey: "ETH", color: "#627eea", desc: "Smart contract core reserve." },
    { name: "Solana", symbol: "SOL", price: prices.SOL, dataKey: "SOL", color: "#14f195", desc: "High-throughput token reserve." },
    { name: "USD Coin", symbol: "USDC", price: prices.USDC, dataKey: "USDC", color: "#2775ca", desc: "1:1 Dollar peg safety cushion." },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Phase Alert */}
      <div className="bg-[#0B0D11] border border-[#23262D] rounded p-4 flex items-start gap-4">
        <div className="p-2 bg-[#38BDF8]/10 text-[#38BDF8] rounded">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5 leading-snug">
            Fase a Solicitud: Arkaios Observa & Documenta (F1)
          </h4>
          <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">
            La IA opera estrictamente de forma pasiva (Sin mover capital real). Monitorea las fluctuaciones financieras, 
            el valor total de la tesorería de MAIN-AMR, y redacta informes formales sobre el estado de la reserva.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Tracker */}
        <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#38BDF8]" />
                Monitoreo de Reservas y Mercado
              </h4>
              <button
                onClick={onRefreshPrices}
                className="text-[#94A3B8] hover:text-[#E2E8F0] p-1.5 rounded border border-[#23262D] hover:bg-[#14161B] transition-colors cursor-pointer"
                title="Generar Fluctuaciones"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="p-3.5 border border-[#23262D]/60 bg-[#0B0D11]/40 rounded hover:border-[#23262D] transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-1 h-9 rounded-sm"
                      style={{ backgroundColor: token.color }}
                    ></span>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-xs text-[#E2E8F0]">{token.name}</span>
                        <span className="text-[9px] font-mono font-bold bg-[#1B1E24] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#2D3139]">
                          {token.symbol}
                        </span>
                      </div>
                      <p className="text-[#64748B] text-[10px] mt-0.5">{token.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tiny Sparkline */}
                    {token.symbol !== "USDC" && historicalData.length > 0 && (
                      <div className="w-14 h-7 hidden sm:block opacity-75">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={historicalData}>
                            <Line
                              type="monotone"
                              dataKey={token.dataKey}
                              stroke={token.color}
                              strokeWidth={1}
                              dot={false}
                            />
                            <YAxis domain={["auto", "auto"]} hide />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <div className="text-right">
                      <span className="text-[9px] text-[#64748B] uppercase tracking-wider block font-mono">Spot Price</span>
                      <span className="text-xs font-bold font-mono text-[#E2E8F0] data-font">
                        $ {token.price.toLocaleString("en-US", { minimumFractionDigits: token.symbol === "USDC" ? 4 : 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#23262D]">
            <button
              onClick={requestAIReport}
              disabled={loading}
              className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#090A0C] font-mono font-bold uppercase tracking-wider py-3 px-4 rounded flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#090A0C]" />
                  REDACTANDO INFORME FORMAL...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current text-[#090A0C]" />
                  GENERAR PROPUESTA POR IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI report output */}
        <div className="bg-[#0B0D11]/40 border border-[#23262D] rounded p-6 shadow-sm lg:col-span-7 min-h-[300px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#23262D] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#94A3B8]">
                OFICINA DE ANÁLISIS DE RIESGO
              </h4>
            </div>
            {analysisReport && (
              <span className="text-[9px] font-mono bg-[#1B1E24] pb-1 pt-0.5 px-2.5 rounded font-bold text-[#E2E8F0] border border-[#2D3139]">
                SOPORTE GEMINI ACTIVO
              </span>
            )}
          </div>

          {analysisReport ? (
            <div className="bg-[#090A0C] border border-[#23262D] rounded-lg p-5 overflow-auto max-h-[440px] shadow-sm flex-1 text-[#E2E8F0]">
              <MarkdownRenderer content={analysisReport} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 flex-1 border border-dashed border-[#23262D] rounded">
              <Sparkles className="w-10 h-10 text-[#23262D] mb-3 animate-pulse" />
              <p className="text-[#E2E8F0] text-xs font-mono font-bold uppercase tracking-wider">BUZÓN DE INFORMES VACÍO</p>
              <p className="text-[#94A3B8] text-[11px] max-w-xs mt-2 leading-relaxed">
                Haz clic en el botón de la izquierda para que el Analizador IA de Arkaios evalúe las variables macro y redacte una 
                propuesta soberana de asignación.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
