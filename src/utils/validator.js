const { validationResult } = require('express-validator');
const { BadRequestError } = require('./errors.js');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  next(new BadRequestError(errors.array()[0].msg));
};

module.exports = {
  validate,
};
