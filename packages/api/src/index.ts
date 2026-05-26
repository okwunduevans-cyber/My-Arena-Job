import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './services/logger';
import { authenticate } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// --- SECURITY MIDDLEWARE ---
app.use(helmet()); // XSS, Clickjacking protection
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'DEEP FX Operational', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

// --- AUTHENTICATED ROUTES ---
app.get('/api/signals', authenticate, (req, res) => {
  res.json({ message: 'Secure signal data' });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Unhandled Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// --- WEBSOCKET STABILITY ---
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('heartbeat', () => {
    socket.emit('heartbeat_ack');
  });

  socket.on('disconnect', (reason) => {
    logger.info(`Client disconnected: ${socket.id} Reason: ${reason}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info(`🚀 DEEP FX Production Backend running on port ${PORT}`);
});
