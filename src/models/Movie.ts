import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: String,
  released: Date,
  genre: String,
  directory: String,
  created: {
    by: Number,
    at: Date,
  },
});

export default mongoose.model('Movie', schema);
