"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const ledger_1 = __importDefault(require("./routes/ledger"));
const companies_1 = __importDefault(require("./routes/companies"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const chat_1 = __importDefault(require("./routes/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow all origins (web dashboards on Render/Vercel, Expo mobile apps, and local tools)
        callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
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
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/ledger', ledger_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/chat', chat_1.default);
// Health checks
app.get('/', (req, res) => {
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
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        app: 'VoltMart / Elemark B2B Electrical Marketplace Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
app.get('/api/health', (req, res) => {
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
