const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('./utils/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://niche-finder-frontend.onrender.com',
      'https://niche-finder-api-man3.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});
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
