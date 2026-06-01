import { Treasury, EcosystemRevenueSource } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Shield, Sparkles, ShoppingBag, Radio, ArrowUpRight, Award, Plus } from "lucide-react";
import { useState } from "react";

interface TreasuryOverviewProps {
  treasury: Treasury;
  onGenerateFees: (category: "ai_services" | "marketplace" | "validators", amount: number) => void;
}

export default function TreasuryOverview({ treasury, onGenerateFees }: TreasuryOverviewProps) {
  const [actingSource, setActingSource] = useState<string | null>(null);

  const treasuryCards = [
    {
      key: "reservaPrincipal" as keyof Treasury,
      name: "Reserva Principal",
      value: treasury.reservaPrincipal,
      color: "#F59E0B", // Gold/Amber
      borderClass: "border-l-4 border-l-[#F59E0B] treasury-gradient",
      desc: "Resguardo fundamental a largo plazo para asegurar la solvencia del ecosistema Arkaios.",
    },
    {
      key: "reservaEmergencia" as keyof Treasury,
      name: "Reserva de Emergencia",
      value: treasury.reservaEmergencia,
      color: "#EF4444", // Red
      borderClass: "border-l-4 border-l-[#EF4444]",
      desc: "Colchón de liquidez de disponibilidad inmediata para paliar cisnes negros o exploits.",
    },
    {
      key: "fondoExpansion" as keyof Treasury,
      name: "Fondo de Expansión",
      value: treasury.fondoExpansion,
      color: "#8B5CF6", // Purple
      borderClass: "border-l-4 border-l-[#8B5CF6]",
      desc: "Capital asignado a acelerar el crecimiento, incentivar adopción y financiar builders.",
    },
    {
      key: "fondoIA" as keyof Treasury,
      name: "Fondo de IA",
      value: treasury.fondoIA,
      color: "#38BDF8", // Blue
      borderClass: "border-l-4 border-l-[#38BDF8]",
      desc: "Asignación exclusiva para pagar APIs, entrenar bots, mantener infraestructura y GPUs.",
    },
    {
      key: "fondoLiquidez" as keyof Treasury,
      name: "Fondo de Liquidez",
      value: treasury.fondoLiquidez,
      color: "#10B981", // Emerald
      borderClass: "border-l-4 border-l-[#10B981]",
      desc: "Aporte en pools de AMM para asegurar un deslizamiento de precio bajo en tokens de MAIN-AMR.",
    },
  ];

  const chartData = treasuryCards.map((card) => ({
    name: card.name,
    value: card.value,
    color: card.color,
  }));

  const simulateEconomicActivity = (sourceId: string, category: "ai_services" | "marketplace" | "validators", amount: number) => {
    setActingSource(sourceId);
    setTimeout(() => {
      onGenerateFees(category, amount);
      setActingSource(null);
    }, 550);
  };

  const revenueSources = [
    {
      id: "ai-com",
      name: "Uso de Modelos & Agentes IA",
      category: "ai_services" as const,
      description: "Comisión estándar por inferencia de agentes IA descentralizados en MAIN-AMR.",
      rewardAmount: 250,
      icon: Sparkles,
      accentColor: "text-[#38BDF8]",
      bgAccent: "bg-[#38BDF8]/10",
    },
    {
      id: "market-fee",
      name: "Tasa del Marketplace (1%)",
      category: "marketplace" as const,
      description: "Regalías y tarifas cobradas en la compra de activos y NFTs en el mercado oficial.",
      rewardAmount: 180,
      icon: ShoppingBag,
      accentColor: "text-[#10B981]",
      bgAccent: "bg-[#10B981]/10",
    },
    {
      id: "val-reward",
      name: "Recompensa de Nodos Validadores",
      category: "validators" as const,
      description: "Bloques minados y recompensas distribuidas al tesoro central por asegurar el consenso.",
      rewardAmount: 500,
      icon: Radio,
      accentColor: "text-[#F59E0B]",
      bgAccent: "bg-[#F59E0B]/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Treasury Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#38BDF8]" />
            Módulos de Reserva Soberana
          </h3>
          <span className="text-[10px] text-[#94A3B8] font-mono uppercase bg-[#1B1E24] px-2 py-0.5 rounded border border-[#2D3139]">
            5 Módulos Autónomos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {treasuryCards.map((card) => {
            return (
              <div
                key={card.key}
                className={`glass-card rounded p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-zinc-700/50 ${card.borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-wider bg-[#14161B]/50 text-[#94A3B8] border border-[#23262D]">
                      MODULAR
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: card.color }}></span>
                  </div>
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-[#E2E8F0] mb-1">{card.name}</h4>
                  <p className="text-[#94A3B8] text-[10px] leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-2 pt-3 border-t border-[#23262D]">
                  <span className="text-[9px] text-[#64748B] uppercase tracking-wider block font-mono">Saldo actual</span>
                  <span className="text-lg font-bold text-[#E2E8F0] data-font">
                    $ {card.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Chart & Self-Sustenance Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart Representation */}
        <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 shadow-sm lg:col-span-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] mb-1 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#38BDF8]" />
            Distribución Relativa
          </h4>
          <p className="text-[#94A3B8] text-[10px] mb-6 uppercase tracking-wider">Asignación porcentual de reservas activas.</p>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Monto"]}
                  contentStyle={{ backgroundColor: "#0C0E12", color: "#E2E8F0", borderRadius: "4px", border: "1px solid #23262D" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest block">Total</span>
              <span className="text-sm font-bold text-[#E2E8F0] data-font">100%</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-[#23262D] pt-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }}></span>
                  <span className="text-[#94A3B8] text-[11px]">{d.name}</span>
                </div>
                <span className="font-mono text-[#E2E8F0] font-semibold text-[11px]">
                  {((d.value / Object.values(treasury).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Self-Sustenance Simulator (Generador de Valor) */}
        <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                Mecanismo de Sostenibilidad (Autosustento de MAIN-AMR)
              </h4>
              <span className="text-[9px] bg-[#14161B] text-[#10B981] px-2.5 py-0.5 rounded-full font-mono font-bold border border-[#10B981]/20">
                SISTEMA AUTÓNOMO
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs mb-6 max-w-xl leading-relaxed">
              El Banco de Arkaios se autofinancia de forma genuina. Al simular interacciones de los usuarios o cobros de 
              red, las comisiones se inyectan a la tesorería soberana automáticamente. Haz clic para simular ingresos:
            </p>

            <div className="space-y-4">
              {revenueSources.map((source) => {
                const Icon = source.icon;
                const isActingCheck = actingSource === source.id;

                return (
                  <div
                    key={source.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded border border-[#23262D]/60 bg-[#0B0D11]/60 hover:bg-[#14161B]/60 transition-all duration-200 gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2 rounded ${source.bgAccent} ${source.accentColor} border border-[#23262D]`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">{source.name}</h5>
                        <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">{source.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-[#23262D] sm:border-0 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[9px] text-[#64748B] uppercase tracking-widest block font-mono">Tasa Estimada</span>
                        <span className="text-xs font-semibold text-[#10B981] font-mono flex items-center gap-0.5 justify-end">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +${source.rewardAmount} USDC
                        </span>
                      </div>
                      <button
                        onClick={() => simulateEconomicActivity(source.id, source.category, source.rewardAmount)}
                        disabled={!!actingSource}
                        className={`text-[10px] uppercase font-mono font-bold tracking-wider py-2 px-4 rounded transition-all duration-150 cursor-pointer ${
                          isActingCheck
                            ? "bg-[#10B981] text-[#090A0C] cursor-wait scale-[0.98] shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : "bg-[#1B1E24] hover:bg-[#23262D] text-[#E2E8F0] border border-[#2D3139] active:scale-[0.98] disabled:opacity-50"
                        }`}
                      >
                        {isActingCheck ? "Inyectando..." : "Simular Flujo"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#23262D] bg-[#090A0C]/40 -mx-6 -mb-6 p-4 rounded-b">
            <span className="text-[9px] font-mono text-[#38BDF8] block uppercase tracking-wider mb-1.5 font-bold">
              DESTINO AUTOMÁTICO DE CUOTAS DE EMISIÓN:
            </span>
            <p className="text-[#94A3B8] text-[10px] leading-relaxed">
              Las cuotas de <strong className="text-[#E2E8F0] font-semibold">Servicios de IA</strong> nutren el <strong className="text-[#38BDF8] font-bold">Fondo de IA</strong> para respaldar la infraestructura de procesamiento distribuido. Las comisiones de <strong className="text-[#E2E8F0] font-semibold">Marketplace</strong> alimentan el <strong className="text-[#10B981] font-bold">Fondo de Liquidez</strong>. Las recompensas de <strong className="text-[#E2E8F0] font-semibold font-mono">Nodos Validadores</strong> se direccionan a la <strong className="text-[#F59E0B] font-bold">Reserva Principal</strong> para solidificar la estabilidad financiera general del ecosistema Arkaios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
