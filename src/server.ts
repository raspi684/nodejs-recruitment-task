import express from 'express';
import { json } from 'body-parser';
import { movieRoutes } from './routes/movies';
import { AuthError, BadRequestError, UnauthorizedError } from './utils/errors';
import { errorHandler } from './middleware/errorHandler';
import { JWT_SECRET } from './config/env';
import { authFactory } from './auth';

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(json());

app.get('/test', (req, res) => {
  res.send();
});

app.post('/auth', (req, res, next) => {
  if (!req.body) {
    return next(new BadRequestError('Invalid payload'));
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return next(new BadRequestError('Invalid payload'));
  }

  try {
    const token = auth(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return next(new UnauthorizedError(error.message));
    }

    next(error);
  }
});

app.use(movieRoutes);
app.use(errorHandler);

export = app;
