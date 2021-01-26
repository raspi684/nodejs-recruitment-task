import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import * as Movies from '../controllers/movies';
import { validate } from '../utils/validator';
import storeMovieRequest from '../requests/storeMovieRequest';

const movieRoutes = Router();

movieRoutes.get('/movies', Movies.index);
movieRoutes.post(
  '/movies',
  isAuthenticated,
  validate(storeMovieRequest),
  Movies.store,
);

export {
  movieRoutes,
};
