// server.js (Node.js backend with Khipu API v3 integration)

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const KHIPU_API_URL = 'https://sandbox.khipu.com/api/3.0/payments';
const KHIPU_API_KEY = process.env.KHIPU_API_KEY;

// Define the BASE_URL as your Render app URL
const BASE_URL = 'https://khipudemo.onrender.com/'; // Replace with your actual Render URL

app.post('/create-payment', async (req, res) => {
  try {
    const paymentData = {
      subject: 'Demo Payment',
      currency: 'CLP',
      amount: 2000,
      transaction_id: 'demo-' + Date.now(),
      return_url: `${BASE_URL}/return`,   // Use the dynamic BASE_URL for the return URL
      cancel_url: `${BASE_URL}/cancel`,   // Use the dynamic BASE_URL for the cancel URL
      notification_url: `${BASE_URL}/notification`, // Use the dynamic BASE_URL for the notification URL
      payer_email: 'test@example.com',
      bank_id: 'demobank'
    };

    const response = await axios.post(KHIPU_API_URL, paymentData, {
      headers: {
        Authorization: `Bearer ${KHIPU_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const paymentURL = response.data.payment_url;
    res.status(200).json({ url: paymentURL });
  } catch (error) {
    console.error('Error creating payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error creating payment', detail: error.response?.data || error.message });
  }
});

app.post('/notification', (req, res) => {
  console.log('Notification received:', req.body);
  res.sendStatus(200);
});

app.get('/return', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/failure.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

