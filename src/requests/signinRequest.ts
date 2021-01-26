import { body } from 'express-validator';

export default [
  body('username')
    .notEmpty()
    .withMessage('username fields is required'),
  body('password')
    .notEmpty()
    .withMessage('password fields is required'),
];
