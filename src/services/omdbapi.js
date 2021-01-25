const fetch = require('node-fetch');
const { NotFoundError } = require('../utils/errors');

const { OMDBAPI_KEY } = process.env;
if (!OMDBAPI_KEY) {
  throw new Error('OMDBAPI_KEY is not in env variables');
}

module.exports.fetchMovie = async (title) => {
  // Fetch movie data from OMDb
  const url = new URL('https://omdbapi.com/');
  url.searchParams.append('apikey', process.env.OMDBAPI_KEY);
  url.searchParams.append('t', title);
  const response = await fetch(url);
  const data = await response.json();

  // Throw error if movie doesn't exists
  if (data && data.Response === 'False') {
    throw new NotFoundError(data?.Error);
  }
  return data;
};
