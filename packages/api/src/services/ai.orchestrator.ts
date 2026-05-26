export type AIProvider = 'DEEPSEEK' | 'OLLAMA' | 'OPENAI';

export interface AIAnalysisRequest {
  symbol: string;
  timeframe: string;
  indicators: any;
  marketContext: string;
}

export interface AIAnalysisResponse {
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  rationale: string;
  educationalNote: string;
  invalidationPoint: number;
}

export class AIOrchestrator {
  private provider: AIProvider;
  private apiKey: string;

  constructor(provider: AIProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async analyzeMarket(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    // This is the orchestration layer that maps the internal request 
    // to the specific LLM prompt and parses the response.
    console.log(`Analyzing ${request.symbol} using ${this.provider}...`);
    
    // Mock implementation of the AI logic for the foundation
    return {
      direction: 'BUY',
      confidence: 85,
      rationale: 'Strong H4 bullish bias alignment with M1 10 EMA equilibrium recovery. Liquidity sweep detected at previous low.',
      educationalNote: 'This is a classic continuation setup. Notice how price failed to close below the 10 EMA on the M1, indicating buyers are stepping in at equilibrium.',
      invalidationPoint: 2320.50
    };
  }
}
