import mongoose from 'mongoose';
import supertest from 'supertest';
import nock from 'nock';
import app from '../server';
import { omdbapiNotFoundResponse, omdbapiOkResponse } from './omdbapi-mock';
import Movie from '../models/Movie';
import { MONGO_IP, OMDBAPI_KEY } from '../config/env';

const request = supertest(app);
let basicToken = '';
let premiumToken = '';

async function createMovies(token: string, count: number) {
  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await request.post('/movies')
      .auth(token, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(201);
    // eslint-disable-next-line no-underscore-dangle,no-await-in-loop
    await Movie.updateOne({ _id: res.body._id }, { $set: { title: `${res.body.title}-${i}` } })
      .exec();
  }
}

describe('Test movies', () => {
  beforeAll(async () => {
    const mongoUrl = `mongodb://${MONGO_IP}:27017/moviesdb`;
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get JWTs
    basicToken = (await request
      .post('/auth')
      .send({
        username: 'basic-thomas',
        password: 'sR-_pcoow-27-6PAwCD8',
      }))
      .body.token;
    premiumToken = (await request
      .post('/auth')
      .send({
        username: 'premium-jim',
        password: 'GBLtTyq3E_UNjFnpo9m6',
      }))
      .body.token;

    // Mock OMNDbAPI responses
    nock('https://omdbapi.com')
      .persist()
      .get('/')
      .query({
        apikey: OMDBAPI_KEY,
        t: 'Mr Robot',
      })
      .reply(200, omdbapiOkResponse);
    nock('https://omdbapi.com')
      .persist()
      .get('/')
      .query({
        apikey: OMDBAPI_KEY,
        t: 'UnknownMovieTitle',
      })
      .reply(200, omdbapiNotFoundResponse);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    // eslint-disable-next-line no-restricted-syntax
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      // @ts-ignore
      // eslint-disable-next-line no-await-in-loop
      await collection.deleteMany();
    }
  }

  afterEach(async () => {
    await removeAllCollections();
  });

  it('should return an array', async (done) => {
    const res = await request.get('/movies');

    expect(res.status)
      .toEqual(200);
    expect(Array.isArray(res.body))
      .toBe(true);
    done();
  });

  it('should return an unauthorized error', async (done) => {
    const res = await request.post('/movies')
      .send({ title: '' });

    expect(res.status)
      .toEqual(401);
    done();
  });

  it('should return an bad request error', async (done) => {
    const res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: '' });
    expect(res.status)
      .toEqual(400);

    done();
  });

  it('should create movie', async (done) => {
    const res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(201);
    // eslint-disable-next-line no-underscore-dangle
    const createdMovie = await Movie.findById(res.body._id);
    expect(createdMovie)
      .toBeTruthy();
    done();
  });

  it('should return created movie', async (done) => {
    const res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(201);
    expect(res.body.title)
      .toBeTruthy();
    done();
  });

  it('should return a bad request error (movie already exists)', async (done) => {
    let res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(201);
    res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(400);
    done();
  });

  it('should create 5 movies (basic user)', async (done) => {
    await createMovies(basicToken, 5);
    done();
  });

  it('should not create 6 movies (basic user)', async (done) => {
    await createMovies(basicToken, 5);
    const res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'Mr Robot' });
    expect(res.status)
      .toEqual(400);
    done();
  });

  it('should create 6 movies (premium user)', async (done) => {
    await createMovies(premiumToken, 6);
    done();
  });

  it('should return a not found error for not existing movie', async (done) => {
    const res = await request.post('/movies')
      .auth(basicToken, { type: 'bearer' })
      .send({ title: 'UnknownMovieTitle' });
    expect(res.status)
      .toEqual(404);
    done();
  });
});
