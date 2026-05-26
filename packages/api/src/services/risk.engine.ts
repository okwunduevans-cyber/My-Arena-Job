export interface RiskConfig {
  maxDailyLossPercent: number;
  maxDrawdownPercent: number;
  volatilityMultiplier: number;
}

export class RiskManagementEngine {
  private config: RiskConfig;

  constructor(config: RiskConfig) {
    this.config = config;
  }

  validateTrade(accountBalance: number, riskAmount: number, currentDrawdown: number): { allowed: boolean; reason?: string } {
    // 1. Check Max Daily Loss
    if (riskAmount > accountBalance * (this.config.maxDailyLossPercent / 100)) {
      return { allowed: false, reason: 'Trade risk exceeds max daily loss limit.' };
    }

    // 2. Check Equity Drawdown Protection
    if (currentDrawdown > this.config.maxDrawdownPercent) {
      return { allowed: false, reason: 'Account is in high drawdown. Trading suspended for protection.' };
    }

    return { allowed: true };
  }

  calculateLotSize(balance: number, riskPercent: number, stopLossPips: number, pipValue: number): number {
    const riskAmount = balance * (riskPercent / 100);
    const lotSize = riskAmount / (stopLossPips * pipValue);
    return parseFloat(lotSize.toFixed(2));
  }
}
