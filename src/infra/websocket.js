import { io } from 'socket.io-client';

import { MonsterRepository } from './repositories/monster';
import { HeroRepository } from './repositories/hero';
import { GetHeroesNearby } from '../app/use-cases/get-heroes-nearby';
import { HandleIncident } from '../app/use-cases/handle-incident';

export class MonsterWebSocket {
  constructor() {
    const heroRepository = new HeroRepository();
    const monsterRepository = new MonsterRepository();

    this.handleIncident = new HandleIncident(heroRepository, monsterRepository);
    this.getHeroesNearby = new GetHeroesNearby(heroRepository);

    this.socket = io(process.env.MONSTER_WEBSOCKET, {
      autoConnect: false,
    });
    this.socket.connect();
  }

  setup() {
    this.socket.on('incident', this.incident.bind(this));
  }

  async incident({ monsterName, dangerLevel, location }) {
    const heroes = await this.getHeroesNearby.execute({
      location,
      dangerLevel,
    });

    await this.handleIncident.execute({
      monsterName,
      dangerLevel,
      location,
      heroes,
    });
  }
}
