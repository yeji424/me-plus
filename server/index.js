require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db.js');
const app = express();
const PORT = 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from Express Server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
