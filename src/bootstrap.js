import mongoose from 'mongoose';

import { HeroRepository } from './repositories/hero';
import { MonsterRepository } from './repositories/monster';
import { MonsterWebSocket } from './websocket';

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

(async () => {
  await mongoose.connect(process.env.MONGO_URL, config);

  const monsterRepository = new MonsterRepository();
  const heroRepository = new HeroRepository();

  const monsterWebSocket = new MonsterWebSocket(
    monsterRepository,
    heroRepository
  );
  monsterWebSocket.setup();
})();
