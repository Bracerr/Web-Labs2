import request from 'supertest';
import { app } from './app.js';
import { sequelize } from './config/db.js';
import { authHandler } from './handlers/authHandler.js';

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  await authHandler.deleteTestUsers();
  await sequelize.close();
});

describe('Auth API Tests', () => {
  const API_KEY = 'SECRET_KEY'; 

  // Тесты базового функционала
  describe('Basic Functionality', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    };

    test('Should successfully register a new user', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('api_key', API_KEY)
        .send(validUser);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', validUser.email);
    });

    test('Should successfully login', async () => {
      const res = await request(app)
        .post('/auth/signin')
        .set('api_key', API_KEY)
        .send({
          email: validUser.email,
          password: validUser.password
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });
  });


  // Тесты на некорректные данные
  describe('Invalid Input Tests', () => {
    test('Should fail registration with missing fields', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('api_key', API_KEY)
        .send({
          username: 'test'
          // отсутствуют email и password
        });
      expect(res.status).toBe(400);
    });

    test('Should fail registration with invalid email', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('api_key', API_KEY)
        .send({
          username: 'test',
          email: 'invalid-email',
          password: 'password123'
        });
      expect(res.status).toBe(400);
    });

    test('Should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/signin')
        .set('api_key', API_KEY)
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });
      expect(res.status).toBe(401);
    });
  });

  // Тесты на некорректный JSON
  describe('Malformed JSON Tests', () => {
    test('Should handle malformed JSON in request body', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('api_key', API_KEY)
        .set('Content-Type', 'application/json')
        .send('{username: "test", email: "test@test.com", password: "test"}}'); // Некорректный JSON
      expect(res.status).toBe(400);
    });
  });

  // Тесты refresh token
  describe('Refresh Token Tests', () => {
    test('Should fail refresh with invalid token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('api_key', API_KEY)
        .send({
          refreshToken: 'invalid-token'
        });
      expect(res.status).toBe(401);
    });

    test('Should fail refresh without token', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .set('api_key', API_KEY)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  // Тесты на неправильные маршруты
  describe('Invalid Routes Tests', () => {
    test('Should return 404 for non-existent route', async () => {
      const res = await request(app)
        .post('/auth/nonexistent')
        .set('api_key', API_KEY)
        .send({});
      expect(res.status).toBe(404);
    });
  });

  // Тесты на заголовки
  describe('Headers Tests', () => {
    test('Should fail without API key', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          username: 'test',
          email: 'test@test.com',
          password: 'password123'
        });
      expect(res.status).toBe(403);
    });

    test('Should fail with invalid content-type', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'text/plain')
        .set('api_key', API_KEY)
        .send('plain text data');
      expect(res.status).toBe(400);
    });
  });
});

