require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./server');
const { MONGO_IP, PORT } = require('./config/env');

const mongoUrl = `mongodb://${MONGO_IP}:27017/moviesdb`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`auth svc is listening on port ${PORT}`);
  });
});
