import { useState, useMemo } from "react";
import { Treasury } from "../types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Award, HelpCircle, Loader2, Sparkles, BookOpen } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface SimulationEngineProps {
  treasury: Treasury;
}

export default function SimulationEngine({ treasury }: SimulationEngineProps) {
  const [strategyName, setStrategyName] = useState("Liquid Staking Conservador");
  const [percentage, setPercentage] = useState(5); // 5%
  const [targetAsset, setTargetAsset] = useState("ETH");
  const [durationMonths, setDurationMonths] = useState(12);

  const [loading, setLoading] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  const totalValue = useMemo(() => {
    return Object.values(treasury).reduce((a, b) => a + b, 0);
  }, [treasury]);

  const simulatedAmount = useMemo(() => {
    return (totalValue * (percentage / 100));
  }, [totalValue, percentage]);

  // Expected APY estimates
  const expectedApy = useMemo(() => {
    if (targetAsset === "ETH") return 4.25;
    if (targetAsset === "SOL") return 6.8;
    if (targetAsset === "BTC") return 1.85;
    return 5.10; // USDC / default
  }, [targetAsset]);

  // Mock-up dynamic backtest chart data
  const chartData = useMemo(() => {
    const data = [];
    const monthlyApyDecimal = expectedApy / 12 / 100;
    
    let baselineValue = totalValue;
    let simulatedValue = totalValue;

    for (let month = 0; month <= durationMonths; month++) {
      // flat or very small generic growth for baseline
      const baselineGain = baselineValue * 0.0005; 
      baselineValue += baselineGain;

      // growth based on allocating designated portion into higher simulated yield
      const actionCapital = simulatedAmount;
      const untouchedCapital = totalValue - simulatedAmount;
      
      const activeGrowth = actionCapital * Math.pow(1 + monthlyApyDecimal, month);
      const standardGrowth = untouchedCapital * Math.pow(1 + 0.0005, month);
      simulatedValue = activeGrowth + standardGrowth;

      data.push({
        name: `Mes ${month}`,
        "Tesorería Plana": Math.round(baselineValue),
        "Tesorería Simulada": Math.round(simulatedValue),
        RendimientoExtra: Math.round(simulatedValue - baselineValue),
      });
    }
    return data;
  }, [totalValue, simulatedAmount, expectedApy, durationMonths]);

  const requestSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/simulate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyName,
          percentage,
          targetAsset,
          durationMonths,
          treasury,
        }),
      });
      const data = await response.json();
      setSimulationReport(data.report);
    } catch (err) {
      console.error(err);
      setSimulationReport("Fallo de conexión al lanzar la simulación. Favor de revisar la clave API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-[#0B0D11] border border-[#23262D] rounded p-4 flex items-start gap-4">
        <div className="p-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5 leading-snug">
            Fase 2: Arkaios Simula (F2) — Sin riesgo de capital real
          </h4>
          <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">
            Permite proyectar retornos e impactos de estrategias de Staking/Aporte de Liquidez. Se evalúa el impacto 
            virtual sobre la tesorería de MAIN-AMR, ayudando a programar la prudencia antes del despliegue en Sandbox.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] flex items-center gap-1.5 border-b border-[#23262D] pb-3">
              <Award className="w-4 h-4 text-[#F59E0B]" />
              Parámetros de Simulación Virt.
            </h4>

            {/* Strategy Title Input */}
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Nombre de la Estrategia</label>
              <input
                type="text"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#F59E0B] font-medium font-mono"
              />
            </div>

            {/* Percentage Allocation Slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider mb-1.5">
                <span>Asignación de Tesorería</span>
                <span className="font-mono bg-[#1B1E24] text-[#E2E8F0] px-2 py-0.5 rounded border border-[#2D3139]">{percentage}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-[#14161B] rounded appearance-none cursor-pointer accent-[#F59E0B]"
              />
              <span className="text-[10px] text-[#64748B] block mt-2 font-mono">
                Capital virtual implicado: <strong className="text-[#E2E8F0] font-bold">${simulatedAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })} USDC</strong>
              </span>
            </div>

            {/* Target Asset selection */}
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-2">Activo de Destino</label>
              <div className="grid grid-cols-4 gap-2">
                {["ETH", "SOL", "USDC", "BTC"].map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setTargetAsset(asset)}
                    className={`p-2.5 rounded text-xs font-mono font-bold border transition-all cursor-pointer ${
                      targetAsset === asset
                        ? "bg-[#F59E0B] text-[#090A0C] border-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                        : "bg-[#0B0D11] text-[#94A3B8] border-[#23262D] hover:bg-[#14161B] hover:text-[#E2E8F0]"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#64748B] block mt-2.5 font-mono">
                Rendimiento estimado de red: <strong className="text-[#10B981] font-bold">+{expectedApy}% APY</strong>
              </span>
            </div>

            {/* Duration select */}
            <div>
              <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Duración de Simulación</label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#F59E0B] font-mono font-bold"
              >
                <option value={3}>3 Meses</option>
                <option value={6}>6 Meses</option>
                <option value={12}>12 Meses (1 año)</option>
                <option value={18}>18 Meses</option>
                <option value={24}>24 Meses (2 años)</option>
              </select>
            </div>
          </div>

          <button
            onClick={requestSimulation}
            disabled={loading}
            className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#090A0C] font-mono font-bold uppercase tracking-wider py-3 px-4 rounded flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99] disabled:opacity-50 mt-6 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#090A0C]" />
                EJECUTANDO MODELACIÓN APY...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#090A0C] fill-current" />
                SIMULAR CON INTELIGENCIA ARTIFICIAL
              </>
            )}
          </button>
        </div>

        {/* Projections & Report Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recharts Projections View */}
          <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              Proyección de Crecimiento de Tesorería (Virtual)
            </h4>
            <p className="text-[#94A3B8] text-[10px] mb-4 uppercase tracking-wider">
              Comparativo de reservas de Arkaios con la inyección de {percentage}% a la estrategia de {targetAsset} Staking.
            </p>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#23262D" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={9}
                    tickLine={false}
                    domain={["dataMin - 1000", "dataMax + 1000"]}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Monto de Reserva"]}
                    contentStyle={{ backgroundColor: "#0C0E12", color: "#E2E8F0", borderRadius: "4px", border: "1px solid #23262D" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Tesorería Plana"
                    stroke="#475569"
                    fill="none"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <Area
                    type="monotone"
                    dataKey="Tesorería Simulada"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#colorSimulated)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#23262D] text-[10px] justify-end font-mono">
              <span className="flex items-center gap-1.5 text-[#64748B] uppercase">
                <span className="w-3 h-0.5 border-t border-dashed border-[#64748B] inline-block"></span>
                Inacción de Reservas
              </span>
              <span className="flex items-center gap-1.5 text-[#F59E0B] font-bold uppercase">
                <span className="w-3 h-1.5 bg-[#F59E0B] rounded-sm inline-block"></span>
                Estrategia Simulada (+${(chartData[chartData.length - 1]?.RendimientoExtra || 0).toLocaleString()} USDC)
              </span>
            </div>
          </div>

          {/* AI generated audit report */}
          <div className="bg-[#0B0D11]/40 border border-[#23262D] rounded p-6 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="flex items-center gap-2 border-b border-[#23262D] pb-3 mb-4">
              <BookOpen className="w-4 h-4 text-[#F59E0B]" />
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#94A3B8]">
                RESUMEN EJECUTIVO Y AUDITORÍA DE IA (SIMULACIÓN F2)
              </h4>
            </div>

            {simulationReport ? (
              <div className="bg-[#090A0C] border border-[#23262D] rounded p-5 overflow-auto max-h-[250px] shadow-sm flex-1 text-[#E2E8F0]">
                <MarkdownRenderer content={simulationReport} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#23262D] rounded flex-1">
                <HelpCircle className="w-8 h-8 text-[#23262D] mb-2.5 animate-pulse" />
                <p className="text-[#E2E8F0] text-xs font-mono font-bold uppercase tracking-wider">NO SE HA INICIADO EL REPORTE IA</p>
                <p className="text-[#94A3B8] text-[11px] max-w-xs mt-2 leading-relaxed">
                  Haz clic en el botón para solicitar que la Inteligencia Artificial analice el perfil matemático, APY y riesgos financieros de esta estrategia de tesorería virtual.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
