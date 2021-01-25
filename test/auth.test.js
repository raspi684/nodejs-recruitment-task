const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');

const request = supertest(app);

describe('Auth test', () => {
  it('should return an bad request error when payload not provided', async (done) => {
    const res = await request.post('/auth');

    expect(res.statusCode).toEqual(400);
    done();
  });

  it('should return an unauthorized error when payload is not correct', async (done) => {
    const res = await request.post('/auth').send({ username: 'abc', password: 'abc' });

    expect(res.statusCode).toEqual(401);
    done();
  });

  it('should return an basic role user', async (done) => {
    const res = await request.post('/auth').send({ username: 'basic-thomas', password: 'sR-_pcoow-27-6PAwCD8' });

    expect(res.statusCode).toEqual(200);
    // eslint-disable-next-line no-prototype-builtins
    expect(res.body.hasOwnProperty('token')).toBe(true);

    try {
      const payload = jwt.decode(res.body.token);
      expect(payload.role).toEqual('basic');
    } catch (e) {
      console.error(e.message);
    }
    done();
  });

  it('should return an premium role user', async (done) => {
    const res = await request.post('/auth').send({ username: 'premium-jim', password: 'GBLtTyq3E_UNjFnpo9m6' });

    expect(res.statusCode).toEqual(200);
    // eslint-disable-next-line no-prototype-builtins
    expect(res.body.hasOwnProperty('token')).toBe(true);

    try {
      const payload = jwt.decode(res.body.token);
      expect(payload.role).toEqual('premium');
    } catch (e) {
      console.error(e.message);
    }
    done();
  });
});
