import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user'), // 'user', 'admin', 'analyst'
  subscriptionTier: text('subscription_tier').default('free'), // 'free', 'premium', 'institutional'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const mtAccounts = sqliteTable('mt_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  metaApiAccountId: text('meta_api_account_id').notNull().unique(),
  accountNumber: text('account_number').notNull(),
  brokerName: text('broker_name'),
  platform: text('platform').notNull(), // 'MT4', 'MT5'
  balance: real('balance'),
  equity: real('equity'),
  lastSync: integer('last_sync', { mode: 'timestamp' }),
});

export const signals = sqliteTable('signals', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull(),
  type: text('type').notNull(), // 'BUY', 'SELL'
  entryPrice: real('entry_price').notNull(),
  stopLoss: real('stop_loss').notNull(),
  takeProfit: real('take_profit').notNull(),
  confidence: integer('confidence').notNull(), // 1-100
  rationale: text('rationale'), // AI reasoning
  educationalNote: text('educational_note'),
  status: text('status').default('ACTIVE'), // 'ACTIVE', 'HIT_TP', 'HIT_SL', 'CLOSED'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  closedAt: integer('closed_at', { mode: 'timestamp' }),
});

export const academyLessons = sqliteTable('academy_lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(), // 'Market Structure', 'Psychology', 'EMA'
  level: text('level').notNull(), // 'Beginner', 'Intermediate', 'Advanced'
  orderIndex: integer('order_index').notNull(),
});

export const userProgress = sqliteTable('user_progress', {
  userId: text('user_id').references(() => users.id),
  lessonId: text('lesson_id').references(() => academyLessons.id),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const tradeJournals = sqliteTable('trade_journals', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  symbol: text('symbol').notNull(),
  type: text('type').notNull(), // 'BUY', 'SELL'
  entryPrice: real('entry_price').notNull(),
  exitPrice: real('exit_price'),
  profitLoss: real('profit_loss'),
  emotion: text('emotion'), // 'Fear', 'Greed', 'Confident', 'Anxious'
  notes: text('notes'),
  aiFeedback: text('ai_feedback'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const userProfiles = sqliteTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => users.id),
  riskTolerance: text('risk_tolerance').default('moderate'), // 'low', 'moderate', 'high'
  tradingStyle: text('trading_style').default('scalper'), // 'scalper', 'day_trader', 'swing'
  totalTrades: integer('total_trades').default(0),
  winRate: real('win_rate').default(0),
});
