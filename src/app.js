import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './lib/mongoose';
import { setupWebSocket } from './lib/websocket';
import routes from './routes';

export const app = express();

setupWebSocket();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);
