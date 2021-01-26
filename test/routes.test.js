const mongoose = require('mongoose');
const supertest = require('supertest');
const nock = require('nock');
const app = require('../src/server');
const Movie = require('../src/models/Movie');

const request = supertest(app);
let basicToken = '';
let premiumToken = '';

const { OMDBAPI_KEY } = process.env;
if (!OMDBAPI_KEY) {
  throw new Error('OMDBAPI_KEY is not in env variables');
}

const omdbapiOkResponse = {
  Title: 'Mr. Robot',
  Year: '2015–2019',
  Rated: 'TV-MA',
  Released: '24 Jun 2015',
  Runtime: '49 min',
  Genre: 'Crime, Drama, Thriller',
  Director: 'N/A',
  Writer: 'Sam Esmail',
  Actors: 'Rami Malek, Christian Slater, Carly Chaikin, Martin Wallström',
  Plot: 'Elliot, a brilliant but highly unstable young cyber-security engineer and vigilante hacker, becomes a key figure in a complex game of global dominance when he and his shadowy allies try to take down the corrupt corporation he works for.',
  Language: 'English, Swedish, Danish, Chinese, Persian, Spanish, Arabic, German',
  Country: 'USA',
  Awards: 'Won 2 Golden Globes. Another 19 wins & 78 nominations.',
  Poster: 'https://m.media-amazon.com/images/M/MV5BMzgxMmQxZjQtNDdmMC00MjRlLTk1MDEtZDcwNTdmOTg0YzA2XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }],
  Metascore: 'N/A',
  imdbRating: '8.6',
  imdbVotes: '331,347',
  imdbID: 'tt4158110',
  Type: 'series',
  totalSeasons: '4',
  Response: 'True',
};
const omdbapiNotFoundResponse = { Response: 'False', Error: 'Movie not found!' };

async function createFiveMovies(token) {
  for (let i = 0; i < 5; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await request.post('/movies').auth(token, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(201);
    // eslint-disable-next-line no-underscore-dangle,no-await-in-loop
    await Movie.updateOne({ _id: res.body._id }, { $set: { title: `${res.body.title}-${i}` } }).exec();
  }
}

describe('Test movies', () => {
  beforeAll(async () => {
    const mongoHost = process.env.MONGO_IP ?? 'localhost';
    const mongoUrl = `mongodb://${mongoHost}:27017/moviesdb`;
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

    nock('https://omdbapi.com')
      .persist()
      .get('/')
      .query({ apikey: OMDBAPI_KEY, t: 'Mr Robot' })
      .reply(200, omdbapiOkResponse);
    nock('https://omdbapi.com')
      .persist()
      .get('/')
      .query({ apikey: OMDBAPI_KEY, t: 'UnknownMovieTitle' })
      .reply(200, omdbapiNotFoundResponse);
  });

  afterAll(async () => {
    // Closes the Mongoose connection
    await mongoose.connection.close();
  });

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    // eslint-disable-next-line no-restricted-syntax
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      // eslint-disable-next-line no-await-in-loop
      await collection.deleteMany();
    }
  }

  afterEach(async () => {
    await removeAllCollections();
  });

  it('should return an array', async (done) => {
    const res = await request.get('/movies');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  it('should return an unauthorized error', async (done) => {
    const res = await request.post('/movies').send({ title: '' });

    expect(res.statusCode).toEqual(401);
    done();
  });

  it('should return an bad request error', async (done) => {
    const res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: '' });
    expect(res.statusCode).toEqual(400);

    done();
  });

  it('should return created movie', async (done) => {
    const res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(201);
    done();
  });

  it('should return created movie', async (done) => {
    const res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(201);
    done();
  });

  it('should return a bad request error (movie already exists)', async (done) => {
    let res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(201);
    res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(400);
    done();
  });

  it('should create 5 movies (basic user)', async (done) => {
    await createFiveMovies(basicToken);
    done();
  });

  it('should not create 6 movies (basic user)', async (done) => {
    await createFiveMovies(basicToken);
    const res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(400);
    done();
  });

  it('should create 6 movies (premium user)', async (done) => {
    await createFiveMovies(premiumToken);
    const res = await request.post('/movies').auth(premiumToken, { type: 'bearer' }).send({ title: 'Mr Robot' });
    expect(res.statusCode).toEqual(201);
    done();
  });

  it('should return a not found error for not existsing movie', async (done) => {
    const res = await request.post('/movies').auth(basicToken, { type: 'bearer' }).send({ title: 'UnknownMovieTitle' });
    expect(res.statusCode).toEqual(404);
    done();
  });
});
