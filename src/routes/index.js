import { Router } from 'express';

import { auth } from '../app/middlewares/auth';
import { general } from './general';
import { heroes } from './heroes';
import { monsters } from './monsters';

export const app = Router();

app.use(general);

app.use(auth);

app.use('/heroes', heroes);
app.use('/monsters', monsters);
