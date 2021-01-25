const Movie = require('../models/Movie');
const { BadRequestError } = require('../utils/errors');
const ombdapi = require('../services/omdbapi');
const dateUtils = require('../utils/date-utils');
const mapper = require('../utils/mapper');
const movieApiToDb = require('../utils/mappers/movieApiToDb');

module.exports.index = async (req, res) => {
  // Retrieve all movies
  const movies = await Movie.find();
  res.send(movies);
};

module.exports.store = async (req, res, next) => {
  // Handle basic user monthly movies limit
  const { user } = res.locals;
  if (user.role === 'basic') {
    const thisMonth = dateUtils.getBeginningCurrentMonth();
    const records = await Movie.find({ 'created.by': user.userId, 'created.at': { $gte: thisMonth } });
    if (records.length >= 5) {
      return next(new BadRequestError('Movies limit reached this month'));
    }
  }

  // Validate request
  const { title } = req.body;
  if (!title || title.length === 0) {
    next(new BadRequestError('Title cannot be empty'));
  } else {
    try {
      const data = mapper.map(movieApiToDb, await ombdapi.fetchMovie(title));

      // Check if movie is already in DB
      const movie = await Movie.findOne({
        title: data.title,
      });
      if (movie) {
        throw new BadRequestError('Movies already exists');
      }
      // Store movie and return it
      const releasedDate = (data.released !== 'N/A') ? new Date(data.released) : null;
      Movie.create({
        ...data,
        released: releasedDate,
        created: {
          at: Date(),
          by: user.userId,
        },
      }).then((createdMovie) => {
        res.status(201).send(createdMovie);
      });
    } catch (e) {
      next(e);
    }
  }
};
