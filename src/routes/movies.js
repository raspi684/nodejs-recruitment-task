const { Router } = require('express');
const isAuthenticated = require('../middleware/auth');
const Movies = require('../controllers/movies.js');
const { validate } = require('../utils/validator');
const storeMovieRequest = require('../requests/storeMovieRequest');

const routes = Router();

routes.get('/movies', Movies.index);
routes.post(
  '/movies',
  isAuthenticated,
  validate(storeMovieRequest),
  Movies.store,
);

module.exports.movieRoutes = routes;
