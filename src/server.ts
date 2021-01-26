import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { movieRoutes } from './routes/movies';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';

const app = express();

app.use(json());

app.get('/test', (req: Request, res: Response) => {
  res.send();
});

app.use(authRoutes);
app.use(movieRoutes);
app.use(errorHandler);

export = app;
