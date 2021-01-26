import { NextFunction, Request, Response } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import { JWT_SECRET } from '../config/env';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Invalid token provided'));
  }

  const token = authorization.split(' ')[1];
  try {
    verify(token, JWT_SECRET);
    res.locals.user = decode(token);
    next();
  } catch (error) {
    return next(new UnauthorizedError(error.message));
  }
};

export {
  isAuthenticated,
};
