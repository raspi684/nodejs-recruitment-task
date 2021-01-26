import { Router } from 'express';
import { validate } from '../utils/validator';
import { signin } from '../controllers/auth';
import signinRequest from '../requests/signinRequest';

const authRoutes = Router();

authRoutes.post(
  '/auth',
  validate(signinRequest),
  signin,
);

export {
  authRoutes,
};
