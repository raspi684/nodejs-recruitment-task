require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./server');

const {
  MONGO_DB, MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER,
} = process.env;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`auth svc is listening on port ${PORT}`);
  });
});
