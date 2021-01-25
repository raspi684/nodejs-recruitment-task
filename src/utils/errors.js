const AuthError = require('./errors/AuthError');
const BadRequestError = require('./errors/BadRequestError');
const UnauthorizedError = require('./errors/UnauthorizedError');
const NotFoundError = require('./errors/NotFoundError');
const ServerError = require('./errors/ServerError');

module.exports = {
  AuthError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ServerError,
};
