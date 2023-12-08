import { Router } from 'express';

import Auth from '../app/middlewares/Auth';

import { general } from './general';
import { heroes } from './heroes';
import { monsters } from './monsters';

export const app = Router();

app.use(general);

app.use(Auth);

app.use('/heroes', heroes);
app.use('/monsters', monsters);
