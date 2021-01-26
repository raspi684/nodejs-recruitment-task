const OMDBAPI_KEY = process.env.OMDBAPI_KEY ?? '';
const JWT_SECRET = process.env.JWT_SECRET ?? '';
const MONGO_IP = process.env.MONGO_IP ?? 'localhost';
const PORT = process.env.APP_PORT ?? 3000;

if (!OMDBAPI_KEY) {
  throw new Error('OMDBAPI_KEY env variable is empty');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env variable is empty');
}

export {
  OMDBAPI_KEY,
  JWT_SECRET,
  MONGO_IP,
  PORT,
};
