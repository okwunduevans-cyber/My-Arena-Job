import axios from 'axios';

export interface TelegramSignal {
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  rationale: string;
  eduNote: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
  }

  async sendSignal(signal: TelegramSignal) {
    const emoji = signal.type === 'BUY' ? '🔵' : '🔴';
    const action = signal.type === 'BUY' ? 'LONG' : 'SHORT';
    
    const message = `
${emoji} *DEEP FX | SIGNAL ALERT* ${emoji}

*Asset:* \#${signal.symbol}
*Direction:* ${action}
*Confidence:* ${signal.confidence}%

*Entry:* ${signal.entry}
*Stop Loss:* ${signal.sl}
*Take Profit:* ${signal.tp}

---
*AI Rationale:*
${signal.rationale}

*Educational Note:*
${signal.eduNote}
---
_Managed by DEEP FX Intelligence_
    `;

    try {
      await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'Markdown',
      });
      console.log(`Signal sent to Telegram for ${signal.symbol}`);
    } catch (error) {
      console.error('Telegram Send Error:', error);
    }
  }
}
