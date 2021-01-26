require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./server');

const mongoHost = process.env.MONGO_IP ?? 'localhost';
const mongoUrl = `mongodb://${mongoHost}:27017/moviesdb`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`auth svc is listening on port ${PORT}`);
  });
});
