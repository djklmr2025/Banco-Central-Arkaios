export interface MarketPrices {
  BTC: number;
  ETH: number;
  SOL: number;
  USDC: number;
}

export interface Treasury {
  reservaPrincipal: number;
  reservaEmergencia: number;
  fondoExpansion: number;
  fondoIA: number;
  fondoLiquidez: number;
}

export type PhaseType = 1 | 2 | 3 | 4;

export interface SandboxBalances {
  USD: number;
  BTC: number;
  ETH: number;
  SOL: number;
  USDC: number;
}

export interface SandboxAction {
  id: string;
  timestamp: string;
  description: string;
  type: "buy" | "sell" | "stake" | "unstake";
  asset: string;
  amount: number;
  valueUSD: number;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  amountUSD: number;
  timestamp: string;
  status: "pending" | "approved" | "rejected" | "executed";
  aiVerdict?: "APROBADA" | "RECHAZADA";
  aiReason?: string;
  aiReport?: string;
}

export interface EcosystemRevenueSource {
  id: string;
  name: string;
  category: "ai_services" | "marketplace" | "validators";
  description: string;
  baseRate: string;
  accumulated: number;
}
