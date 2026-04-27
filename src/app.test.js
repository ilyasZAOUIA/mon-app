const request = require('supertest');
const app = require('./app');

describe('API Routes', () => {

  describe('GET /', () => {
    it('devrait retourner un message de bienvenue', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.status).toBe('running');
    });
  });

  describe('GET /health', () => {
    it('devrait retourner le statut healthy', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/users', () => {
    it('devrait retourner la liste des utilisateurs', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBe(3);
    });

    it('chaque utilisateur doit avoir id, name et email', async () => {
      const res = await request(app).get('/api/users');
      res.body.users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      });
    });
  });

  describe('GET /metrics', () => {
    it('devrait retourner les métriques Prometheus', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('http_requests_total');
      expect(res.text).toContain('nodejs_uptime_seconds');
    });
  });

});
