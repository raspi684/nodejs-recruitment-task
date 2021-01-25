const supertest = require('supertest');
const app = require('../src/server');

const request = supertest(app);

it('should test that /test return 200', async (done) => {
  const res = await request.get('/test');

  expect(res.statusCode).toEqual(200);
  done();
});
