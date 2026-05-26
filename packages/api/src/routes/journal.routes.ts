import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { BehavioralAnalyticsService } from '../services/analytics.service';
import { AIOrchestrator } from '../services/ai.orchestrator';

const router = Router();
const ai = new AIOrchestrator('DEEPSEEK', 'api-key');
const analytics = new BehavioralAnalyticsService(ai);

router.post('/log', authenticate, async (req: AuthRequest, res) => {
  const { symbol, type, entry, exit, pl, emotion, notes } = req.body;
  // Logic to save to SQLite via Drizzle would go here
  res.json({ status: 'Trade logged successfully' });
});

router.get('/analyze', authenticate, async (req: AuthRequest, res) => {
  // Mock journals for the demonstration
  const mockJournals = [
    { symbol: 'XAUUSD', profitLoss: -100, emotion: 'Anxious', notes: 'Entered too early' },
    { symbol: 'XAUUSD', profitLoss: -200, emotion: 'Angry', notes: 'Tried to win back loss' },
    { symbol: 'BTCUSD', profitLoss: 50, emotion: 'Confident', notes: 'Followed the plan' },
  ];
  
  const report = await analytics.analyzeTradingPsychology(req.user!.id, mockJournals);
  res.json(report);
});

export default router;
