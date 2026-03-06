const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('./utils/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database();

const defaultAllowedOrigins = [
  'https://niche-finder-frontend.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Allow Render preview/static subdomains in production deployments.
  return /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// Routes
const nicheRoutes = require('./routes/nicheRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api', nicheRoutes);
app.use('/api', contactRoutes);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Niche Finder API is running' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.get('SELECT 1 as test');
    res.json({ success: true, message: 'Database connection successful', test: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    await db.connect();
    await db.init();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await db.close();
  process.exit(0);
});

startServer();

module.exports = app;
