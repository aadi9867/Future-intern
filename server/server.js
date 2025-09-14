const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const taskRoutes = require('./routes/tasks');
const certificateRoutes = require('./routes/certificates');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/future-intern', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Future Intern API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React frontend in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));
  // Catch-all: send index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'Route not found' });
    }
  });
} else {
  // 404 handler for non-production
  app.use('*', (req, res) => {
    res.status(404).json({ 
      success: false, 
      message: 'Route not found' 
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
}); 