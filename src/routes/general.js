import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';

const app = Router();

app.post('/sessions', SessionController.store);
app.post('/users', UserController.store);

export { app as general };
