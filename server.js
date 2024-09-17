const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const blogRoutes = require('./routes/blogRoutes');
app.use('/api', blogRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
