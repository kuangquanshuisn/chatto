const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./src/routes/chat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
