import { Router } from 'express';

import { HeroController } from '../controllers/hero';

const app = Router();

const heroController = new HeroController();

app.get('/', heroController.index);
app.post('/', heroController.store);
app.put('/:id', heroController.update);
app.delete('/:id', heroController.destroy);

export { app as heroes };
