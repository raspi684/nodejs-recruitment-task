import { NextFunction, Request, Response } from 'express';
import { AuthError, BadRequestError, UnauthorizedError } from '../utils/errors';
import { authFactory } from '../auth';
import { JWT_SECRET } from '../config/env';

const auth = authFactory(JWT_SECRET);

const signin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return next(new BadRequestError('Invalid payload'));
  }

  const {
    username,
    password,
  } = req.body;

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
};

export {
  signin,
};
