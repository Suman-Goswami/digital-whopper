require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Startup logs ---------- */
console.log('-------------------------------');
console.log('🚀 Starting Digital Whopper API');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
console.log('MONGO_URI exists:', Boolean(process.env.MONGO_URI));
console.log('-------------------------------');

/* ---------- Database ---------- */
connectDB();

/* ---------- Middleware ---------- */
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://digital-whopper-tau.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('✅ Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Request origin:', origin || 'No origin');

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ Blocked by CORS:', origin);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Request logger ---------- */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ---------- Health check ---------- */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Digital Whopper API is running',
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend health check OK',
    timestamp: new Date().toISOString()
  });
});

/* ---------- API ---------- */
app.use('/api', apiRoutes);

/* ---------- Serve React build in production ---------- */
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));

  app.get('*', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

/* ---------- 404 handler ---------- */
app.use((req, res) => {
  console.error('❌ Route not found:', req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

/* ---------- Error handler ---------- */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Digital Whopper API running on port ${PORT}`);
});