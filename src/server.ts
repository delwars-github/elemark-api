import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import ledgerRoutes from './routes/ledger';
import companyRoutes from './routes/companies';
import analyticsRoutes from './routes/analytics';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins (web dashboards on Render/Vercel, Expo mobile apps, and local tools)
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);

// Health checks
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'VoltMart B2B Electrical Marketplace Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      ledger: '/api/ledger',
      companies: '/api/companies',
      analytics: '/api/analytics/dashboard',
      chat: '/api/chat'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'VoltMart / Elemark B2B Electrical Marketplace Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start server on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================================');
  console.log(`⚡ VoltMart API Server running on port ${PORT}`);
  console.log(`📡 Local:            http://localhost:${PORT}`);
  console.log(`📱 Android Emulator: http://10.0.2.2:${PORT}`);
  console.log(`🌐 LAN Network:      http://192.168.0.100:${PORT}`);
  console.log('====================================================');
});

