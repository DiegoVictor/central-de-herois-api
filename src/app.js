import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import routes from './routes';
import { connect } from './websocket';

export const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connect();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);
