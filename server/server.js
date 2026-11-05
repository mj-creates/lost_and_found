const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.get('/check', (req, res) => {
    console.log('CHECK ROUTE HIT');

    res.send('DEBUG SERVER WORKING');
});

app.post('/debug-items', (req, res) => {
    console.log('DEBUG POST ROUTE HIT');

    res.json({
        success: true,
        message: 'POST ROUTE WORKING'
    });
});

console.log('DEBUG ROUTES REGISTERED');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/owner'));
app.use('/api/items', require('./routes/items'));
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000
  })
  .then(() => {
    console.log('MongoDB connected');
    console.log('Items router loaded');
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch((err) => console.log('MongoDB error:', err.message));