import { Router } from 'express';

import { MonsterController } from '../controllers/MonsterController';
import { DefeatedController } from '../controllers/DefeatedController';

const app = Router();

const monsterController = new MonsterController();
const defeatedController = new DefeatedController();

app.get('/', monsterController.index);
app.put('/:id/defeated', defeatedController.update);

export { app as monsters };
