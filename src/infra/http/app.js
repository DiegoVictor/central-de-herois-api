import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { setupDatabase } from '../database';
import { MonsterWebSocket } from '../websocket';
import { routes } from './routes';

export const app = express();

setupDatabase(() => {
  const monsterWebSocket = new MonsterWebSocket();
  monsterWebSocket.setup();
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);
