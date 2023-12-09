import { Router } from 'express';

import { HeroController } from '../app/controllers/HeroController';

const app = Router();

const heroController = new HeroController();

app.get('/heroes', heroController.index);
app.post('/heroes', heroController.store);
app.put('/heroes/:id', heroController.update);
app.delete('/heroes/:id', heroController.destroy);

export { app as heroes };
