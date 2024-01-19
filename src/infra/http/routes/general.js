import { Router } from 'express';

import { SessionController } from '../controllers/session';
import { UserController } from '../controllers/user';

const app = Router();

const sessionController = new SessionController();
const userController = new UserController();

app.post('/sessions', sessionController.store);
app.post('/users', userController.store);

export { app as general };
