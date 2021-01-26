import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from './errors';

const validate = (validations: Array<any>) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  next(new BadRequestError(errors.array()[0].msg));
};

export {
  validate,
};
