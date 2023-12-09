import { Router } from 'express';

import { SessionController } from '../app/controllers/SessionController';
import { UserController } from '../app/controllers/UserController';

const app = Router();

const sessionController = new SessionController();
const userController = new UserController();

app.post('/sessions', sessionController.store);
app.post('/users', userController.store);

export { app as general };
