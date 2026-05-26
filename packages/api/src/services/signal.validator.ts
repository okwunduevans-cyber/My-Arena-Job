import { TelegramSignal } from './telegram.service';

export class SignalValidator {
  private activeSignals: Map<string, TelegramSignal> = new Map();

  validate(signal: TelegramSignal): { isValid: boolean; reason?: string } {
    const currentSignal = this.activeSignals.get(signal.symbol);

    // 1. Prevent Duplicate Signals (Same direction within short window)
    if (currentSignal && currentSignal.type === signal.type) {
      return { isValid: false, reason: 'Duplicate signal detected for the same direction.' };
    }

    // 2. Prevent Contradictory Signals (Flip-flopping within 5 minutes)
    if (currentSignal && currentSignal.type !== signal.type) {
      const timeDiff = Date.now() - new Date(currentSignal.timestamp || '').getTime();
      if (timeDiff < 5 * 60 * 1000) {
        return { isValid: false, reason: 'Contradictory signal too soon after previous trade.' };
      }
    }

    // 3. Logic Sanity Check (SL must be below entry for BUY, above for SELL)
    if (signal.type === 'BUY' && signal.sl >= signal.entry) {
      return { isValid: false, reason: 'Invalid SL: Stop Loss must be below entry for BUY trades.' };
    }
    if (signal.type === 'SELL' && signal.sl <= signal.entry) {
      return { isValid: false, reason: 'Invalid SL: Stop Loss must be above entry for SELL trades.' };
    }

    // 4. TP Logic Sanity Check
    if (signal.type === 'BUY' && signal.tp <= signal.entry) {
      return { isValid: false, reason: 'Invalid TP: Take Profit must be above entry for BUY trades.' };
    }
    if (signal.type === 'SELL' && signal.tp >= signal.entry) {
      return { isValid: false, reason: 'Invalid TP: Take Profit must be below entry for SELL trades.' };
    }

    this.activeSignals.set(signal.symbol, signal);
    return { isValid: true };
  }
}
