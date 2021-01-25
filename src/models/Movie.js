const mongoose = require('mongoose');

const schema = mongoose.Schema({
  title: String,
  released: Date,
  genre: String,
  directory: String,
  created: {
    by: Number,
    at: Date,
  },
});

module.exports = mongoose.model('Movie', schema);
