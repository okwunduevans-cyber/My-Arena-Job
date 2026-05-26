import { AIOrchestrator } from './ai.orchestrator';
import { tradeJournals } from '../db/schema';

export class BehavioralAnalyticsService {
  private ai: AIOrchestrator;

  constructor(ai: AIOrchestrator) {
    this.ai = ai;
  }

  async analyzeTradingPsychology(userId: string, journals: any[]) {
    if (journals.length < 3) {
      return { 
        status: 'insufficient_data', 
        message: 'Need at least 3 logged trades to analyze behavior.' 
      };
    }

    const journalSummary = journals.map(j => ({
      symbol: j.symbol,
      result: j.profitLoss > 0 ? 'WIN' : 'LOSS',
      emotion: j.emotion,
      notes: j.notes
    }));

    const prompt = `
      Analyze the following trading journal entries for behavioral patterns:
      ${JSON.stringify(journalSummary)}
      
      Identify:
      1. Psychological leaks (e.g., Revenge trading, FOMO).
      2. Correlation between emotions and losses.
      3. Consistency in strategy.
      4. A professional recommendation for improvement.
    `;

    // Using the orchestrator to get a structured behavioral report
    const analysis = await this.ai.analyzeMarket({
      symbol: 'USER_BEHAVIOR',
      timeframe: 'ACCOUNT_HISTORY',
      indicators: journalSummary,
      marketContext: prompt
    });

    return {
      psychologicalProfile: analysis.rationale,
      growthTip: analysis.educationalNote,
      confidenceScore: analysis.confidence
    };
  }
}
