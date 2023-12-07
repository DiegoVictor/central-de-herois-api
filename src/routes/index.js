import { Router } from 'express';

import Auth from '../app/middlewares/Auth';
import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';
import HeroController from '../app/controllers/HeroController';
import MonsterController from '../app/controllers/MonsterController';
import DefeatedController from '../app/controllers/DefeatedController';

import HeroStore from '../app/validators/Heroes/Store';
import HeroUpdate from '../app/validators/Heroes/Update';

export const app = Router();

app.post('/sessions', SessionController.store);
app.post('/users', UserController.store);

app.use(Auth);

app.get('/heroes', HeroController.index);
app.post('/heroes', HeroStore, HeroController.store);
app.put('/heroes/:id', HeroUpdate, HeroController.update);
app.delete('/heroes/:id', HeroController.destroy);

app.get('/monsters', MonsterController.index);

app.put('/monsters/:id/defeated', DefeatedController.update);
