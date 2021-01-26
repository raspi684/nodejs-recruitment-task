const {
  OMDBAPI_KEY,
  JWT_SECRET,
} = process.env;

let {
  MONGO_IP,
  PORT,
} = process.env;

if (!OMDBAPI_KEY) {
  throw new Error('OMDBAPI_KEY env variable is empty');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env variable is empty');
}

MONGO_IP = MONGO_IP ?? 'localhost';
PORT = PORT || 3000;

module.exports = {
  OMDBAPI_KEY,
  JWT_SECRET,
  MONGO_IP,
  PORT,
};
