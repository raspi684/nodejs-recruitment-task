import fetch from 'node-fetch';
import { NotFoundError } from '../utils/errors';
import { OMDBAPI_KEY } from '../config/env';

const fetchMovie = async (title: string) => {
  // Fetch movie data from OMDb
  const url = new URL('https://omdbapi.com/');
  url.searchParams.append('apikey', OMDBAPI_KEY);
  url.searchParams.append('t', title);
  const response = await fetch(url);
  const data = await response.json();

  // Throw error if movie doesn't exists
  if (data && data.Response === 'False') {
    throw new NotFoundError(data?.Error);
  }
  return data;
};

export {
  fetchMovie,
};
