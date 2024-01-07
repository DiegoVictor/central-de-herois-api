import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './bootstrap';
import { routes } from './routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);
