const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // Check if request has authorization header and it's bearer
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Invalid token provided'));
  }

  const token = authorization.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    res.locals.user = jwt.decode(token);
    next();
  } catch (error) {
    return next(new UnauthorizedError(error.message));
  }
};
