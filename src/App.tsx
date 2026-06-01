import { useState, useEffect, useMemo } from "react";
import { 
  MarketPrices, 
  Treasury, 
  PhaseType, 
  SandboxBalances, 
  SandboxAction, 
  GovernanceProposal 
} from "./types";
import { 
  Shield, 
  Coins, 
  Eye, 
  TrendingUp, 
  FlaskConical, 
  Cpu, 
  History, 
  Sparkles, 
  Plus, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Vote, 
  PlusCircle, 
  ArrowRightLeft, 
  Trash2, 
  Zap, 
  DollarSign, 
  TrendingDown,
  UserCheck
} from "lucide-react";
import Header from "./components/Header";
import TreasuryOverview from "./components/TreasuryOverview";
import AIAnalyzer from "./components/AIAnalyzer";
import SimulationEngine from "./components/SimulationEngine";
import MarkdownRenderer from "./components/MarkdownRenderer";

export default function App() {
  // Navigation & Core Phase
  const [currentPhase, setCurrentPhase] = useState<PhaseType>(1);

  // Asset Spot Prices State
  const [prices, setPrices] = useState<MarketPrices>({
    BTC: 89450.50,
    ETH: 3125.20,
    SOL: 184.80,
    USDC: 1.0000,
  });

  // Central Sovereign Treasury State
  const [treasury, setTreasury] = useState<Treasury>({
    reservaPrincipal: 85000.00,
    reservaEmergencia: 12500.00,
    fondoExpansion: 20100.22,
    fondoIA: 10250.00,
    fondoLiquidez: 15000.00,
  });

  // Calculate Net Total Reservoir
  const treasuryTotal = useMemo(() => {
    return treasury.reservaPrincipal + treasury.reservaEmergencia + treasury.fondoExpansion + treasury.fondoIA + treasury.fondoLiquidez;
  }, [treasury]);

  // Phase 3 (Sandbox Virtual Portfolio) State
  const [sandboxBalances, setSandboxBalances] = useState<SandboxBalances>({
    USD: 10000.00,
    BTC: 0.025,
    ETH: 1.25,
    SOL: 12.00,
    USDC: 2500.00
  });

  // Sandbox Transaction Log State
  const [sandboxActions, setSandboxActions] = useState<SandboxAction[]>([
    {
      id: "sb-1",
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString().replace("T", " ").substring(0, 19),
      description: "Inicialización regulada de cuenta virtual",
      type: "stake",
      asset: "USD",
      amount: 10000.00,
      valueUSD: 10000.00
    },
    {
      id: "sb-2",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString().replace("T", " ").substring(0, 19),
      description: "Conversión de USD a BTC en simulador sandbox",
      type: "buy",
      asset: "BTC",
      amount: 0.025,
      valueUSD: 2236.25
    }
  ]);

  // Phase 4 (Governance & Strict caps) State
  const [proposals, setProposals] = useState<GovernanceProposal[]>([
    {
      id: "gov-1",
      title: "Pago de nodo y almacenamiento en la nube para agentes IA",
      description: "Subsidio indispensable proveniente del Fondo de IA para extender el tiempo de inferencia autónoma de los agentes de soporte de Arkaios.",
      amountUSD: 9.50,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString().replace("T", " ").substring(0, 19),
      status: "approved",
      aiVerdict: "APROBADA",
      aiReason: "La propuesta asume un monto saludable e inferior al límite diario de $10 USD (Fase 4), alineado para preservar la soberanía operativa.",
      aiReport: "### AUDITORÍA DE GOBERNANZA ARKAIOS\nLa propuesta solicita $9.50 USD amortizado del Fondo de IA.\n\n* **Prueba de Límites**: El costo de ejecución es menor del límite constitucional estricto ($10.00 USD y 0.1% de tesorería).\n* **Veredicto AI**: APROBADA de forma autónoma dado que la inyección refuerza la persistencia física del propio central bancario."
    },
    {
      id: "gov-2",
      title: "Inversión masiva especulativa de alta volatilidad",
      description: "Retirar capital estructural de la Reserva Principal de Emergencia con la finalidad de adquirir memecoins especulativas basándose en foros públicos.",
      amountUSD: 450.00,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString().replace("T", " ").substring(0, 19),
      status: "rejected",
      aiVerdict: "RECHAZADA",
      aiReason: "El monto solicitado vulnera de manera flagrante el cinturón diario de seguridad de $10 USD o 0.1% de tesorería.",
      aiReport: "### AUDITORÍA DE GOBERNANZA ARKAIOS\nSe denega formalmente la asignación de $450.00 USD.\n\n* **Justificación de Rechazo**: Excede con creces el límite superior autonómico de $10.00 USD diseñado para la Fase 4. La filosofía institucional de Arkaios prohíbe la exposición especulativa de fondos estructurales que amenacen la Reserva de Emergencia."
    }
  ]);

  // Form State for Sandbox Operations
  const [sbOpType, setSbOpType] = useState<"buy" | "sell" | "stake" | "unstake">("buy");
  const [sbAsset, setSbAsset] = useState<"BTC" | "ETH" | "SOL">("ETH");
  const [sbAmount, setSbAmount] = useState<string>("0.5");
  const [autopilotLoading, setAutopilotLoading] = useState(false);

  // Form State for creating Governance Proposals
  const [newPropTitle, setNewPropTitle] = useState("");
  const [newPropDesc, setNewPropDesc] = useState("");
  const [newPropAmount, setNewPropAmount] = useState("5.00");
  const [targetReservoir, setTargetReservoir] = useState<keyof Treasury>("fondoIA");
  const [evaluatingProposal, setEvaluatingProposal] = useState(false);

  // Fluctuates market prices randomly to simulate operational volatility
  const handleRefreshPrices = () => {
    setPrices(prev => {
      const pct = 0.015; // 1.5% max fluctuation
      const fl = (v: number) => v * (1 + (Math.random() * (pct * 2) - pct));
      return {
        BTC: Math.round(fl(prev.BTC) * 100) / 100,
        ETH: Math.round(fl(prev.ETH) * 100) / 100,
        SOL: Math.round(fl(prev.SOL) * 100) / 100,
        USDC: prev.USDC // Static dollar anchor
      };
    });
  };

  // Adds simulated fees directly from commercial user actions to central bank reservoirs
  const handleGenerateFees = (category: "ai_services" | "marketplace" | "validators", amount: number) => {
    setTreasury(prev => {
      if (category === "ai_services") {
        return { ...prev, fondoIA: prev.fondoIA + amount };
      } else if (category === "marketplace") {
        return { ...prev, fondoLiquidez: prev.fondoLiquidez + amount };
      } else {
        // validators go straight to primary reserve
        return { ...prev, reservaPrincipal: prev.reservaPrincipal + amount };
      }
    });
  };

  // Calculates current estimated portfolio value in Sandbox virtual desk
  const sandboxPortfolioValue = useMemo(() => {
    const usd = sandboxBalances.USD;
    const usdc = sandboxBalances.USDC;
    const btcVal = sandboxBalances.BTC * prices.BTC;
    const ethVal = sandboxBalances.ETH * prices.ETH;
    const solVal = sandboxBalances.SOL * prices.SOL;
    return usd + usdc + btcVal + ethVal + solVal;
  }, [sandboxBalances, prices]);

  // Executes standard Sandbox manual trade simulation
  const handleExecuteSandboxTrade = (overrideType?: "buy" | "sell" | "stake" | "unstake", overrideAsset?: "BTC" | "ETH" | "SOL", overrideAmt?: number) => {
    const opType = overrideType || sbOpType;
    const asset = overrideAsset || sbAsset;
    const amt = overrideAmt !== undefined ? overrideAmt : parseFloat(sbAmount);

    if (isNaN(amt) || amt <= 0) {
      alert("Por favor introduce una cantidad válida.");
      return;
    }

    const price = prices[asset];
    const totalCostUSD = amt * price;

    if (opType === "buy") {
      if (sandboxBalances.USD < totalCostUSD) {
        alert("Fondos virtuales insuficientes en USD para realizar esta compra.");
        return;
      }
      setSandboxBalances(prev => ({
        ...prev,
        USD: prev.USD - totalCostUSD,
        [asset]: prev[asset] + amt
      }));
      logSandboxAction("Compra manual en Sandbox", "buy", asset, amt, totalCostUSD);
    } else if (opType === "sell") {
      if (sandboxBalances[asset] < amt) {
        alert(`No posees suficiente ${asset} virtual en tu balanza.`);
        return;
      }
      setSandboxBalances(prev => ({
        ...prev,
        USD: prev.USD + totalCostUSD,
        [asset]: prev[asset] - amt
      }));
      logSandboxAction("Venta manual en Sandbox", "sell", asset, amt, totalCostUSD);
    } else if (opType === "stake") {
      if (sandboxBalances[asset] < amt) {
        alert(`No posees suficiente ${asset} en balance líquido para hacer staking.`);
        return;
      }
      setSandboxBalances(prev => ({
        ...prev,
        [asset]: prev[asset] - amt,
        USDC: prev.USDC + totalCostUSD // Simulamos que genera USDC líquido equivalente para recompensas
      }));
      logSandboxAction(`Delegación de Staking (${asset})`, "stake", asset, amt, totalCostUSD);
    } else if (opType === "unstake") {
      // Simulado inverso
      setSandboxBalances(prev => ({
        ...prev,
        [asset]: prev[asset] + amt
      }));
      logSandboxAction(`Deshacer Staking (${asset})`, "unstake", asset, amt, totalCostUSD);
    }
  };

  const logSandboxAction = (desc: string, type: "buy" | "sell" | "stake" | "unstake", asset: string, amount: number, valueUSD: number) => {
    const newAction: SandboxAction = {
      id: "sb-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      description: desc,
      type,
      asset,
      amount,
      valueUSD: Math.round(valueUSD * 100) / 100
    };
    setSandboxActions(prev => [newAction, ...prev]);
  };

  // Triggers Gemini Autopilot for Sandbox recommendations
  const handleLaunchAutopilot = async () => {
    setAutopilotLoading(true);
    try {
      // Formulate query using general model analysis endpoint
      const response = await fetch("/api/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices, treasury }),
      });
      const data = await response.json();
      
      // Select an autonomic smart decision based on analyzed values
      const randomDecide = Math.random();
      let tradeAsset: "BTC" | "ETH" | "SOL" = "ETH";
      if (prices.SOL < 180) tradeAsset = "SOL";
      else if (Math.random() > 0.6) tradeAsset = "BTC";

      const amtToTrade = tradeAsset === "BTC" ? 0.015 : tradeAsset === "ETH" ? 0.25 : 2.5;
      const tradeCost = amtToTrade * prices[tradeAsset];

      if (sandboxBalances.USD >= tradeCost) {
        setSandboxBalances(prev => ({
          ...prev,
          USD: prev.USD - tradeCost,
          [tradeAsset]: prev[tradeAsset] + amtToTrade
        }));
        logSandboxAction("Acción sugerida por Autopiloto IA", "buy", tradeAsset, amtToTrade, tradeCost);
      } else {
        // Fallback unstake or simple USDC safety shift
        logSandboxAction("IA sugiere rebalancear liquidez a USDC", "stake", "USDC", 100, 100);
      }

    } catch (err) {
      console.error(err);
      // Fallback trade simulation if server offline
      logSandboxAction("IA Autopilot recomienda acumulación de ETH", "buy", "ETH", 0.1, 0.1 * prices.ETH);
    } finally {
      setAutopilotLoading(false);
    }
  };

  // Calls server-side Gemini governance evaluation checkpoint to check safety rules
  const handleEvaluateProposal = async () => {
    if (!newPropTitle || !newPropDesc) {
      alert("Por favor rellena el título y la descripción.");
      return;
    }

    const amt = parseFloat(newPropAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Introduce un monto de acción válido.");
      return;
    }

    setEvaluatingProposal(true);
    try {
      const response = await fetch("/api/governance-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalTitle: newPropTitle,
          proposalDescription: newPropDesc,
          treasury: treasury,
          limitUSD: amt
        }),
      });

      const data = await response.json();

      const newProposal: GovernanceProposal = {
        id: "gov-" + Math.random().toString(36).substring(2, 9),
        title: newPropTitle,
        description: newPropDesc,
        amountUSD: amt,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        status: data.verdict === "APROBADA" ? "approved" : "rejected",
        aiVerdict: data.verdict,
        aiReason: data.reason || "Auditoría realizada por el Banco Central Autónomo de Arkaios.",
        aiReport: data.report || "No se ha podido estructurar el informe."
      };

      setProposals(prev => [newProposal, ...prev]);
      
      // Clear inputs upon success
      setNewPropTitle("");
      setNewPropDesc("");
      setNewPropAmount("5.00");

    } catch (err) {
      console.error(err);
      alert("Fallo procesando la auditoría. Asegúrate de que el backend esté activo.");
    } finally {
      setEvaluatingProposal(false);
    }
  };

  // Executes approved proposals, altering central reservoir state
  const handleExecuteProposal = (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    if (prop.status !== "approved") {
      alert("Solo se pueden ejecutar las propuestas formalmente APROBADAS por el motor de riesgo.");
      return;
    }

    // Deduct from designated reservoir
    setTreasury(prev => {
      const currentVal = prev[targetReservoir];
      if (currentVal < prop.amountUSD) {
        alert("Atención: El fondo designado no dispone de suficiente liquidez líquida de respaldo para ejecutar este gasto.");
        return prev;
      }
      return {
        ...prev,
        [targetReservoir]: Math.max(0, currentVal - prop.amountUSD)
      };
    });

    // Update proposal status to executed
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return { ...p, status: "executed" };
      }
      return p;
    }));

    alert(`La propuesta de $${prop.amountUSD} USD ha sido enviada a blockchain y ejecutada de manera autónoma en el módulo "${targetReservoir}".`);
  };

  // Deletes proposal logs
  const handleDeleteProposal = (proposalId: string) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  return (
    <div className="min-h-screen bg-[#090A0C] text-[#E2E8F0] pb-12">
      {/* Top Navigation & Brand Header */}
      <Header 
        currentPhase={currentPhase} 
        onPhaseChange={setCurrentPhase} 
        treasuryTotal={treasuryTotal} 
      />

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Core Structuring Layer: Treasury Cards Visible Across All Phases */}
        <section className="bg-[#0C0E12] border border-[#23262D] rounded p-6 shadow-sm">
          <TreasuryOverview 
            treasury={treasury} 
            onGenerateFees={handleGenerateFees} 
          />
        </section>

        {/* Dynamic Navigation Module Deck */}
        <section className="space-y-6">
          <div className="border-b border-[#23262D] pb-3 flex items-center justify-between">
            <h2 className="text-[#E2E8F0] uppercase font-mono font-bold tracking-wider text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#38BDF8]"></span>
              Vista de Control: {currentPhase === 1 ? "Fase 1 (Observa)" : currentPhase === 2 ? "Fase 2 (Simula)" : currentPhase === 3 ? "Fase 3 (Sandbox)" : "Fase 4 (Autonomía)"}
            </h2>
            <span className="text-[10px] text-[#94A3B8] font-mono uppercase bg-[#1B1E24] px-2 py-1 rounded border border-[#2D3139]">
              Nivel de Incidencia IA: {currentPhase === 1 ? "Lectura Pasiva" : currentPhase === 2 ? "Auditoría de Políticas" : currentPhase === 3 ? "Simulación de Cartera" : "Emisión y Gobernanza"}
            </span>
          </div>

          {currentPhase === 1 && (
            <AIAnalyzer 
              prices={prices} 
              treasury={treasury} 
              onRefreshPrices={handleRefreshPrices} 
            />
          )}

          {currentPhase === 2 && (
            <SimulationEngine 
              treasury={treasury} 
            />
          )}

          {currentPhase === 3 && (
            <div className="space-y-6">
              
              {/* Context Block for Sandbox Phase */}
              <div className="bg-[#0B0D11] border border-[#23262D] rounded p-4 flex items-start gap-4">
                <div className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5 leading-snug">
                    Fase 3: Cámara de Pruebas Sandbox (F3) — Simulación de Cartera Activa
                  </h4>
                  <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">
                    Arkaios opera un portafolio de activos virtuales seguro para entrenar al módulo decisor autónomo. 
                    El usuario puede comprar, vender y delegar staking simulando pequeñas asignaciones tácticas, o permitir 
                    que la IA efectúe transacciones autónomas mediante el modo de autopiloto.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Portfolio Status Deck */}
                <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-4 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] mb-1 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#8B5CF6]" />
                      Portafolio Virtual
                    </h4>
                    <p className="text-[#94A3B8] text-[10px] uppercase tracking-wider">Activos asignados en el ambiente Sandbox.</p>
                  </div>

                  <div className="bg-[#090A0C] border border-[#23262D] rounded p-4 text-center">
                    <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest block mb-0.5">Valor Neto Estimado</span>
                    <span className="text-xl font-bold font-mono text-[#10B981] data-font">
                      $ {sandboxPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-[#94A3B8]">USD</span>
                    </span>
                  </div>

                  {/* Portfolio Balances List */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs p-2 border-b border-[#23262D]/60 bg-[#14161B]/40 px-3 rounded">
                      <span className="text-[#94A3B8] font-semibold">USD Líquido:</span>
                      <span className="font-mono text-[#E2E8F0] font-bold">${sandboxBalances.USD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 border-b border-[#23262D]/60 bg-[#14161B]/40 px-3 rounded">
                      <span className="text-[#94A3B8] font-semibold">USDC Generado:</span>
                      <span className="font-mono text-[#E2E8F0] font-bold">${sandboxBalances.USDC.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 border-b border-[#23262D]/60 bg-[#14161B]/40 px-3 rounded">
                      <span className="text-[#94A3B8] font-semibold">Bitcoin (BTC):</span>
                      <span className="font-mono text-[#E2E8F0] font-bold">{sandboxBalances.BTC.toFixed(4)} BTC <span className="text-[10px] text-[#64748B]">(${Math.round(sandboxBalances.BTC * prices.BTC)})</span></span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 border-b border-[#23262D]/60 bg-[#14161B]/40 px-3 rounded">
                      <span className="text-[#94A3B8] font-semibold">Ethereum (ETH):</span>
                      <span className="font-mono text-[#E2E8F0] font-bold">{sandboxBalances.ETH.toFixed(3)} ETH <span className="text-[10px] text-[#64748B]">(${Math.round(sandboxBalances.ETH * prices.ETH)})</span></span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 border-b border-[#23262D]/60 bg-[#14161B]/40 px-3 rounded">
                      <span className="text-[#94A3B8] font-semibold">Solana (SOL):</span>
                      <span className="font-mono text-[#E2E8F0] font-bold">{sandboxBalances.SOL.toFixed(1)} SOL <span className="text-[10px] text-[#64748B]">(${Math.round(sandboxBalances.SOL * prices.SOL)})</span></span>
                    </div>
                  </div>

                  <div className="border-t border-[#23262D]/80 pt-4">
                    <button
                      onClick={handleLaunchAutopilot}
                      disabled={autopilotLoading}
                      className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-mono font-bold uppercase tracking-wider py-3 px-4 rounded flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    >
                      {autopilotLoading ? "ESTUDIANDO EL CANAL..." : "AUTOCABILA: AUTOPILOTO IA"}
                    </button>
                    <span className="text-[9px] text-[#64748B] block text-center mt-2 font-mono uppercase">
                      Inferencia rápida de riesgo por Gemini 3.5-Flash
                    </span>
                  </div>
                </div>

                {/* Operations Terminal Input */}
                <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] mb-4 flex items-center gap-1.5 border-b border-[#23262D] pb-3">
                      <ArrowRightLeft className="w-4 h-4 text-[#8B5CF6]" />
                      Operar Sandbox Virtual
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Operation type */}
                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Tipo de Movimiento</label>
                        <div className="space-y-2">
                          {[
                            { id: "buy", lbl: "COMPRAR ACTIVO" },
                            { id: "sell", lbl: "VENDER ACTIVO" },
                            { id: "stake", lbl: "STAKING DE RESERVA" },
                            { id: "unstake", lbl: "RETIRAR DE STAKING" }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => setSbOpType(t.id as any)}
                              className={`w-full p-2.5 rounded text-left font-mono font-bold text-[10px] tracking-wide border cursor-pointer ${
                                sbOpType === t.id
                                  ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]"
                                  : "bg-[#0B0D11] border-[#23262D] text-[#94A3B8] hover:bg-[#14161B]"
                              }`}
                            >
                              {t.lbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select Asset */}
                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Seleccionar Reserva</label>
                        <div className="space-y-2">
                          {[
                            { id: "BTC", name: "Bitcoin", col: "#f7931a" },
                            { id: "ETH", name: "Ethereum", col: "#627eea" },
                            { id: "SOL", name: "Solana", col: "#14f195" }
                          ].map(a => (
                            <button
                              key={a.id}
                              onClick={() => setSbAsset(a.id as any)}
                              className={`w-full p-3 rounded text-left border cursor-pointer flex justify-between items-center ${
                                sbAsset === a.id
                                  ? "bg-[#14161B] border-zinc-500 text-[#E2E8F0]"
                                  : "bg-[#0B0D11] border-[#23262D] text-[#94A3B8] hover:bg-[#14161B]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.col }}></span>
                                <span className="text-xs font-mono font-bold">{a.id} ({a.name})</span>
                              </div>
                              <span className="text-[10px] text-[#64748B] font-mono">${Math.round(prices[a.id as keyof MarketPrices])}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Enter Amount */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Cantidad</label>
                          <input
                            type="text"
                            value={sbAmount}
                            onChange={(e) => setSbAmount(e.target.value)}
                            className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#8B5CF6] font-bold font-mono text-center"
                          />
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {[
                              { label: "0.1", val: 0.1 },
                              { label: "1.0", val: 1.0 },
                              { label: "5.0", val: 5.0 }
                            ].map(btn => (
                              <button
                                key={btn.label}
                                onClick={() => setSbAmount(btn.label)}
                                className="bg-[#14161B] hover:bg-[#1B1E24] border border-[#23262D] text-[10px] p-1 rounded font-mono text-[#94A3B8] hover:text-[#E2E8F0] cursor-pointer"
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-[#23262D] pt-4 mt-6">
                          <span className="text-[10px] text-[#64748B] block font-mono mb-2 uppercase">Carga Estimada:</span>
                          <span className="text-sm font-mono text-[#E2E8F0] font-bold block mb-4">
                            $ {(parseFloat(sbAmount) * prices[sbAsset] || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDC
                          </span>

                          <button
                            onClick={() => handleExecuteSandboxTrade()}
                            className="w-full bg-[#1B1E24] hover:bg-zinc-800 text-[#E2E8F0] border border-[#2D3139] font-mono font-bold py-3 rounded text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                          >
                            Ejecutar Movimiento Virtual
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-widest flex items-center gap-2 mb-3">
                      <History className="w-3.5 h-3.5" />
                      LOG DE OPERACIONES SANDBOX (VIRTUALES)
                    </h3>
                    <div className="bg-[#090A0C] border border-[#23262D] rounded max-h-[140px] overflow-y-auto p-2 font-mono text-[10px] space-y-1.5 divide-y divide-[#23262D]/40">
                      {sandboxActions.map((act) => (
                        <div key={act.id} className="pt-1.5 flex justify-between text-[#94A3B8]">
                          <div>
                            <span className="text-[#64748B] mr-2">[{act.timestamp}]</span>
                            <span className="font-bold text-[#E2E8F0]">{act.description}</span>
                            <span className="mx-1 text-[#64748B]">•</span>
                            <span className="uppercase text-[#8B5CF6]">{act.type}</span>
                            <span className="mx-1 text-[#64748B]">{act.amount} {act.asset}</span>
                          </div>
                          <span className="text-emerald-500 font-bold">$ {act.valueUSD.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {currentPhase === 4 && (
            <div className="space-y-6">
              
              {/* Context Block for Autonomy Phase */}
              <div className="bg-[#0B0D11] border border-[#23262D] rounded p-4 flex items-start gap-4">
                <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5 leading-snug">
                    Fase 4: Límites de Autonomía de Gasto & Gobernanza Real (F4)
                  </h4>
                  <p className="text-[#94A3B8] text-[11px] mt-1 leading-relaxed">
                    La IA de Arkaios ejecuta micro-acciones reales. Para preservar la cordura financiera, se aplica un 
                    cierre de seguridad estricto del <strong>0.1% de la tesorería (~${Math.round(treasuryTotal * 0.001)} USD)</strong> con un límite máximo estricto de <strong>$10 USD diarios por transacción</strong>. 
                    Cree propuestas de gasto a continuación y sométalas a evaluación. Si son APROBADAS por el reglamento de IA, 
                    ejecútelas para verlas reflejadas físicamente en los saldos estructurales.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Proposal Designer and Checker */}
                <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] flex items-center gap-1.5 border-b border-[#23262D] pb-3">
                      <Vote className="w-4 h-4 text-[#10B981]" />
                      Creador de Propuestas
                    </h4>

                    {/* Proposal Title */}
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Título de la Acción</label>
                      <input
                        type="text"
                        value={newPropTitle}
                        placeholder="Ej. Hosting de Agentes, Fee Recurrentes"
                        onChange={(e) => setNewPropTitle(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#10B981] font-semibold"
                      />
                    </div>

                    {/* Target Reservoir */}
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Bolsa del Tesoro a Retirar</label>
                      <select
                        value={targetReservoir}
                        onChange={(e) => setTargetReservoir(e.target.value as any)}
                        className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#10B981] font-semibold font-mono"
                      >
                        <option value="fondoIA">FONDO DE IA</option>
                        <option value="fondoExpansion">FONDO DE EXPANSIÓN</option>
                        <option value="fondoLiquidez">FONDO DE LIQUIDEZ</option>
                        <option value="reservaPrincipal">RESERVA PRINCIPAL</option>
                        <option value="reservaEmergencia">RESERVA DE EMERGENCIA</option>
                      </select>
                    </div>

                    {/* Proposal description */}
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider block mb-1.5">Justificación de Emisión</label>
                      <textarea
                        value={newPropDesc}
                        rows={3}
                        placeholder="Describa por qué el Banco de Arkaios debe financiar esta pequeña tarea..."
                        onChange={(e) => setNewPropDesc(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#0B0D11] border border-[#2D3139] rounded text-[#E2E8F0] focus:outline-none focus:border-[#10B981] resize-none"
                      />
                    </div>

                    {/* Action Gasto */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-[#94A3B8] tracking-wider mb-1.5">
                        <span>Monto de la Acción</span>
                        <span className="text-[#10B981] font-bold">Límite Máx: $10.00</span>
                      </div>
                      <div className="relative rounded border border-[#2D3139] bg-[#0B0D11]">
                        <span className="absolute left-3 top-2.5 text-xs text-[#64748B] font-mono">$</span>
                        <input
                          type="number"
                          step="0.50"
                          value={newPropAmount}
                          onChange={(e) => setNewPropAmount(e.target.value)}
                          className="w-full text-xs p-2.5 pl-7 bg-transparent rounded text-[#E2E8F0] focus:outline-none font-bold font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[9px] text-[#64748B] font-mono uppercase font-bold">USD</span>
                      </div>
                      <div className="flex justify-between mt-2 text-[9px] text-[#64748B] font-mono uppercase">
                        <span>Porcentaje de cartera:</span>
                        <span className="text-[#E2E8F0]">
                          {((parseFloat(newPropAmount) || 0) / treasuryTotal * 100).toFixed(4)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEvaluateProposal}
                    disabled={evaluatingProposal}
                    className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-[#090A0C] font-mono font-bold uppercase tracking-wider py-3 px-4 rounded flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99] disabled:opacity-50 mt-6 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  >
                    {evaluatingProposal ? "AUDITANDO PARÁMETROS..." : "ENVIAR A AUDITORÍA IA"}
                  </button>
                </div>

                {/* Proposals Ledger Column */}
                <div className="bg-[#0C0E12] border border-[#23262D] rounded p-6 lg:col-span-8 flex flex-col justify-between h-[520px]">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0] mb-4 flex items-center gap-1.5 border-b border-[#23262D] pb-3 justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-[#10B981]" />
                        Historial de Acciones & Votos de Auditoría IA
                      </div>
                      <span className="text-[10px] text-[#94A3B8] font-mono">{proposals.length} PROCESADAS</span>
                    </h4>

                    {/* Master proposal logs */}
                    <div className="space-y-4 max-h-[420px] overflow-auto pr-2">
                      {proposals.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-[#23262D] rounded">
                          <AlertCircle className="w-8 h-8 text-[#23262D] mx-auto mb-2" />
                          <p className="text-xs font-mono text-[#94A3B8]">Sin registros de gobernanza autónoma</p>
                        </div>
                      ) : (
                        proposals.map((prop) => {
                          const isApproved = prop.aiVerdict === "APROBADA" || prop.aiVerdict === "APROBADA_MOCK";
                          return (
                            <div 
                              key={prop.id}
                              className="border border-[#23262D] rounded bg-[#0B0D11]/40 p-4 space-y-3 relative hover:border-[#10B981]/30 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="text-xs font-bold uppercase text-[#E2E8F0]">{prop.title}</h5>
                                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                      prop.status === "executed"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : isApproved
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                    }`}>
                                      {prop.status === "executed" ? "EJECUTADA" : prop.status === "approved" ? "APROBADA" : "RECHAZADA"}
                                    </span>
                                  </div>
                                  <p className="text-[#94A3B8] text-[10px] leading-relaxed max-w-xl">{prop.description}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] text-[#64748B] block font-mono">EMISIÓN</span>
                                  <span className="text-sm font-bold font-mono text-[#E2E8F0] data-font">$ {prop.amountUSD.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="bg-[#090A0C] border border-[#23262D]/60 p-3 rounded text-[10px] space-y-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                  {isApproved ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-500" />
                                  )}
                                  <span className={isApproved ? "text-[#10B981]" : "text-rose-400"}>
                                    DICTAMEN: {prop.aiReason}
                                  </span>
                                </div>
                                <details className="cursor-pointer">
                                  <summary className="text-[9px] text-[#64748B] uppercase tracking-wider font-mono select-none hover:text-[#94A3B8] transition-colors mb-1.5">
                                    VER INFORME DE RIESGOS IA
                                  </summary>
                                  <div className="bg-[#14161B]/60 p-3 rounded border border-[#23262D]/40 text-[#94A3B8] space-y-1">
                                    <MarkdownRenderer content={prop.aiReport || ""} />
                                  </div>
                                </details>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-[#23262D]/40">
                                <span className="text-[9px] text-[#64748B] font-mono uppercase">[{prop.timestamp}]</span>
                                <div className="flex gap-2">
                                  {prop.status === "approved" && (
                                    <button
                                      onClick={() => handleExecuteProposal(prop.id)}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-[#090A0C] font-mono text-[9px] font-bold px-3 py-1.5 rounded uppercase cursor-pointer"
                                    >
                                      Ejecutar Gasto Real
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteProposal(prop.id)}
                                    className="text-[#64748B] hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                    title="Eliminar Registro"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
