import { Router } from 'express';

import MonsterController from '../app/controllers/MonsterController';
import DefeatedController from '../app/controllers/DefeatedController';

const app = Router();

app.get('/monsters', MonsterController.index);
app.put('/monsters/:id/defeated', DefeatedController.update);

export { app as monsters };
