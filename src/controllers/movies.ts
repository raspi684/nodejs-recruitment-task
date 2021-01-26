import { NextFunction, Request, Response } from 'express';
import movieApiToDb from '../utils/mappers/movieApiToDb';
import { BadRequestError } from '../utils/errors';
import { fetchMovie } from '../services/omdbapi';
import { getBeginningCurrentMonth } from '../utils/date-utils';
import { keyMapper } from '../utils/mappers';
import Movie from '../models/Movie';

const index = async (req: Request, res: Response) => {
  // Retrieve all movies
  const movies = await Movie.find();
  res.send(movies);
};

const store = async (req: Request, res: Response, next: NextFunction) => {
  // Handle basic user monthly movies limit
  const { user } = res.locals;
  if (user.role === 'basic') {
    const thisMonth = getBeginningCurrentMonth();
    const records = await Movie.find({
      'created.by': user.userId,
      'created.at': { $gte: thisMonth },
    });
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
      const jsonMovie = await fetchMovie(title);
      const data = keyMapper(movieApiToDb, jsonMovie);

      // Check if movie is already in DB
      const movie = await Movie.findOne({
        // @ts-ignore
        title: data.title,
      });
      if (movie) {
        throw new BadRequestError('Movies already exists');
      }
      // Store movie and return it
      // @ts-ignore
      const releasedDate = (data.released !== 'N/A') ? new Date(data.released) : null;
      Movie.create({
        ...data,
        released: releasedDate,
        created: {
          at: Date(),
          by: user.userId,
        },
      })
        .then((createdMovie: any) => {
          res.status(201)
            .send(createdMovie);
        });
    } catch (e) {
      next(e);
    }
  }
};

export {
  index,
  store,
};
