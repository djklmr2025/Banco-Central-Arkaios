import { PhaseType } from "../types";
import { ShieldCheck, Eye, Compass, FlaskConical, Cpu, Server, TrendingUp } from "lucide-react";

interface HeaderProps {
  currentPhase: PhaseType;
  onPhaseChange: (phase: PhaseType) => void;
  treasuryTotal: number;
}

export default function Header({ currentPhase, onPhaseChange, treasuryTotal }: HeaderProps) {
  const phases = [
    {
      id: 1 as PhaseType,
      title: "Fase 1: Observa",
      desc: "Análisis e Informes",
      icon: Eye,
      color: "border-[#23262D] text-[#94A3B8] bg-[#0E1116]",
      activeColor: "bg-[#38BDF8] text-[#090A0C] border-[#38BDF8] font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]",
    },
    {
      id: 2 as PhaseType,
      title: "Fase 2: Simula",
      desc: "Simulación de Políticas",
      icon: TrendingUp,
      color: "border-[#23262D] text-[#94A3B8] bg-[#0E1116]",
      activeColor: "bg-[#F59E0B] text-[#090A0C] border-[#F59E0B] font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    },
    {
      id: 3 as PhaseType,
      title: "Fase 3: Sandbox",
      desc: "Capital Virtual Seguro",
      icon: FlaskConical,
      color: "border-[#23262D] text-[#94A3B8] bg-[#0E1116]",
      activeColor: "bg-[#8B5CF6] text-white border-[#8B5CF6] font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    },
    {
      id: 4 as PhaseType,
      title: "Fase 4: Autonomía",
      desc: "Límites y Gobernanza",
      icon: Cpu,
      color: "border-[#23262D] text-[#94A3B8] bg-[#0E1116]",
      activeColor: "bg-[#10B981] text-[#090A0C] border-[#10B981] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    },
  ];

  return (
    <header className="bg-[#0C0E12] border-b border-[#23262D] py-5 px-6 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Title and Branding */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 bg-[#F59E0B] rounded-sm flex items-center justify-center font-bold text-[#090A0C] text-xl italic">
              A
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-semibold tracking-wider text-[#E2E8F0] uppercase">
                ARKAIOS <span className="text-[#F59E0B]">TREASURY</span>
              </h1>
              <span className="text-[10px] font-mono font-bold bg-[#1B1E24] text-[#94A3B8] px-2 py-0.5 rounded border border-[#2D3139]">
                MAIN-AMR
              </span>
            </div>
          </div>
          <p className="text-[#94A3B8] text-xs max-w-2xl leading-relaxed">
            Estructura soberana descentralizada y modular de gobernanza financiera. La IA de Arkaios no mueve capital 
            de forma irrestricta: genera informes, simula retornos, gestiona cuentas sandbox y ejecuta pequeñas acciones vigiladas decidiendo bajo rigurosas reglas de emisión.
          </p>
        </div>

        {/* Global Treasury Stat Panel */}
        <div className="bg-[#14161B] border border-[#23262D] rounded-xl p-4 px-6 flex flex-col items-end min-w-[220px] shadow-sm">
          <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Reserva Total</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#E2E8F0] data-font">
            {treasuryTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-[#94A3B8] font-mono">USDC</span>
          </span>
          <div className="text-[10px] text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            Gobernanza Soberana Activa
          </div>
        </div>
      </div>

      {/* Phase Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="border-b border-[#23262D] pb-2 mb-4">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#94A3B8] flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            LÍNEA DE EVOLUCIÓN DE AUTONOMÍA DE LA IA
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((p) => {
            const Icon = p.icon;
            const isSelected = currentPhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPhaseChange(p.id)}
                className={`flex items-start gap-3.5 p-4 rounded border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${p.activeColor} scale-[1.01]`
                    : "bg-[#0B0D11] hover:bg-[#14161B] border-[#23262D] text-[#94A3B8] hover:text-[#E2E8F0]"
                }`}
              >
                <div
                  className={`p-2 rounded flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#090A0C]/10 text-current" : "bg-[#14161B] text-[#94A3B8]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider">{p.title}</h3>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? "text-current opacity-85" : "text-[#64748B]"}`}>
                    {p.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
