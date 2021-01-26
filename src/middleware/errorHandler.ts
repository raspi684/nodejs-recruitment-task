import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError, NotFoundError, ServerError, UnauthorizedError,
} from '../utils/errors';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BadRequestError) {
    return res.status(400)
      .send({
        error: 'Bad request',
        details: err?.message,
      });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401)
      .send({
        error: 'Unauthorized',
        details: err?.message,
      });
  }
  if (err instanceof NotFoundError) {
    return res.status(404)
      .send({
        error: 'Not found',
        details: err?.message,
      });
  }
  if (err instanceof ServerError) {
    return res.status(500)
      .send({ error: 'Internal server error' });
  }
  console.error(
    `Error processing request ${err}. See next message for details`,
  );
  console.error(err);

  return res.status(500)
    .send({ error: 'Internal server error' });
};

export {
  errorHandler,
};
