const { body } = require('express-validator');

module.exports = [
  body('title').notEmpty().withMessage('title is required'),
];
