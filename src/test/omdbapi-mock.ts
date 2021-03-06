const omdbapiOkResponse = {
  Title: 'Mr. Robot',
  Year: '2015–2019',
  Rated: 'TV-MA',
  Released: '24 Jun 2015',
  Runtime: '49 min',
  Genre: 'Crime, Drama, Thriller',
  Director: 'N/A',
  Writer: 'Sam Esmail',
  Actors: 'Rami Malek, Christian Slater, Carly Chaikin, Martin Wallström',
  Plot: 'Elliot, a brilliant but highly unstable young cyber-security engineer and vigilante hacker, becomes a key figure in a complex game of global dominance when he and his shadowy allies try to take down the corrupt corporation he works for.',
  Language: 'English, Swedish, Danish, Chinese, Persian, Spanish, Arabic, German',
  Country: 'USA',
  Awards: 'Won 2 Golden Globes. Another 19 wins & 78 nominations.',
  Poster: 'https://m.media-amazon.com/images/M/MV5BMzgxMmQxZjQtNDdmMC00MjRlLTk1MDEtZDcwNTdmOTg0YzA2XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg',
  Ratings: [{
    Source: 'Internet Movie Database',
    Value: '8.6/10',
  }],
  Metascore: 'N/A',
  imdbRating: '8.6',
  imdbVotes: '331,347',
  imdbID: 'tt4158110',
  Type: 'series',
  totalSeasons: '4',
  Response: 'True',
};

const omdbapiNotFoundResponse = {
  Response: 'False',
  Error: 'Movie not found!',
};

export {
  omdbapiOkResponse,
  omdbapiNotFoundResponse,
};
