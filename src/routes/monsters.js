import { Router } from 'express';

import { MonsterController } from '../app/controllers/MonsterController';
import { DefeatedController } from '../app/controllers/DefeatedController';

const app = Router();

const monsterController = new MonsterController();
const defeatedController = new DefeatedController();

app.get('/', monsterController.index);
app.put('/:id/defeated', defeatedController.update);

export { app as monsters };
