const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 基本的路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chatto API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
