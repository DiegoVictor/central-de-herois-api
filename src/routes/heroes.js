import { Router } from 'express';

import HeroController from '../app/controllers/HeroController';
import HeroStore from '../app/validators/Heroes/Store';
import HeroUpdate from '../app/validators/Heroes/Update';

const app = Router();

app.get('/heroes', HeroController.index);
app.post('/heroes', HeroStore, HeroController.store);
app.put('/heroes/:id', HeroUpdate, HeroController.update);
app.delete('/heroes/:id', HeroController.destroy);

export { app as heroes };
