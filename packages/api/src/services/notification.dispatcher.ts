import { TelegramService, TelegramSignal } from './telegram.service';
import { Server } from 'socket.io';

export class NotificationDispatcher {
  private telegram: TelegramService;
  private io: Server;

  constructor(telegram: TelegramService, io: Server) {
    this.telegram = telegram;
    this.io = io;
  }

  async dispatchSignal(signal: TelegramSignal) {
    // 1. Broadcast to all connected PWA users via WebSocket
    this.io.emit('new_signal', signal);

    // 2. Broadcast to Telegram Channel
    await this.telegram.sendSignal(signal);

    console.log(`Signal dispatched globally for ${signal.symbol}`);
  }
}
