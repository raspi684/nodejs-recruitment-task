const fetch = require('node-fetch');
const { NotFoundError } = require('../utils/errors');
const { OMDBAPI_KEY } = require('../config/env');

module.exports.fetchMovie = async (title) => {
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
