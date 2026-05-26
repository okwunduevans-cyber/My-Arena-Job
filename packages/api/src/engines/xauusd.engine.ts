import { AIOrchestrator, AIAnalysisResponse } from '../services/ai.orchestrator';

export class XauUsdScalpingEngine {
  private ai: AIOrchestrator;

  constructor(ai: AIOrchestrator) {
    this.ai = ai;
  }

  async evaluateSetup(marketData: any): Promise<AIAnalysisResponse | null> {
    const { h4Bias, m1EmaValue, currentPrice, adx, candlePattern } = marketData;

    // 1. Higher Timeframe Filter
    if (adx < 20) return null; // Market too choppy

    const isBullishBias = h4Bias === 'BULLISH';
    const isBearishBias = h4Bias === 'BEARISH';

    // 2. EMA Equilibrium Logic
    // Price must be pulling back to the 10 EMA but NOT breaking structure
    const isHealthyPullback = isBullishBias 
      ? currentPrice >= m1EmaValue && currentPrice <= m1EmaValue * 1.0005 
      : currentPrice <= m1EmaValue && currentPrice >= m1EmaValue * 0.9995;

    if (!isHealthyPullback) return null;

    // 3. Candle Confirmation
    const validPatterns = ['ENGULFING', 'PINBAR', 'RECOVERY'];
    if (!validPatterns.includes(candlePattern)) return null;

    // 4. AI Probabilistic Validation
    const analysis = await this.ai.analyzeMarket({
      symbol: 'XAUUSD',
      timeframe: 'M1',
      indicators: { adx, m1EmaValue, candlePattern },
      marketContext: `H4 Bias is ${h4Bias}. Price is at equilibrium with 10 EMA.`
    });

    if (analysis.confidence < 70) return null;

    return analysis;
  }
}
