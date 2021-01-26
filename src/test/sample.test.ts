import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

it('should test that /test return 200', async (done) => {
  const res = await request.get('/test');

  expect(res.status)
    .toEqual(200);
  done();
});
