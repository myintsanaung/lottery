// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/api/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const resp = await fetch(target, { timeout: 15000, headers: { 'User-Agent': 'thai-lotto-proxy/1.0' } });
    const contentType = resp.headers.get('content-type') || 'application/json';
    const buffer = await resp.buffer();
    res.status(resp.status).set('Content-Type', contentType).send(buffer);
  } catch (err) {
    console.error('Proxy error', err && err.message);
    res.status(500).json({ error: 'Proxy fetch failed', detail: err.message || String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));