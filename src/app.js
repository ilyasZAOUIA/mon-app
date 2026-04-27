const express = require('express');
const app = express();
//comment
app.use(express.json());

let requestCount = 0;
let requestDuration = [];

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    requestCount++;
    requestDuration.push(Date.now() - start);
  });
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur mon API Node.js', version: '1.0.0', status: 'running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
  res.json({ users, total: users.length });
});

app.get('/metrics', (req, res) => {
  const avgDuration = requestDuration.length > 0
    ? requestDuration.reduce((a, b) => a + b, 0) / requestDuration.length
    : 0;
  const metrics = [
    '# HELP http_requests_total Total des requêtes HTTP',
    '# TYPE http_requests_total counter',
    `http_requests_total ${requestCount}`,
    '',
    '# HELP http_request_duration_ms Durée moyenne des requêtes en ms',
    '# TYPE http_request_duration_ms gauge',
    `http_request_duration_ms ${avgDuration.toFixed(2)}`,
    '',
    '# HELP nodejs_uptime_seconds Uptime du processus Node.js',
    '# TYPE nodejs_uptime_seconds gauge',
    `nodejs_uptime_seconds ${process.uptime().toFixed(2)}`,
    '',
    '# HELP nodejs_memory_heap_used_bytes Mémoire heap utilisée',
    '# TYPE nodejs_memory_heap_used_bytes gauge',
    `nodejs_memory_heap_used_bytes ${process.memoryUsage().heapUsed}`,
  ].join('\n');
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
}

module.exports = app;
