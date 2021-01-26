const express = require('express');
const bodyParser = require('body-parser');
const { authFactory } = require('./auth');
const { AuthError } = require('./utils/errors');
const errorHandler = require('./middleware/errorHandler');
const { movieRoutes } = require('./routes/movies');
const { BadRequestError, UnauthorizedError } = require('./utils/errors');
const { JWT_SECRET } = require('./config/env');

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());

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

module.exports = app;
