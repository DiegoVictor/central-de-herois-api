import { io } from 'socket.io-client';

import {
  HEROES_NEEDED_BY_MONSTER_LEVEL,
  INITIAL_RANGE_IN_METERS,
  MAX_RANGE_IN_METERS,
  MONSTER_STATUS_NAMED,
} from './utils/constants';

export class MonsterWebSocket {
  socket = io(process.env.MONSTER_WEBSOCKET, {
    autoConnect: false,
  });

  constructor(monsterRepository, heroRepository) {
    this.monsterRepository = monsterRepository;
    this.heroRepository = heroRepository;
  }

  setup() {
    this.socket.connect();
    this.socket.on('occurrence', this.occurrence.bind(this));
  }

  async getHeroesIdNearFrom({
    latitude,
    longitude,
    dangerLevel,
    meters = INITIAL_RANGE_IN_METERS,
  }) {
    const nearHeroes = await this.heroRepository.findReadyForCombatNearFrom({
      longitude,
      latitude,
      meters,
    });

    const heroesByRank = nearHeroes.reduce(
      (count, hero) => {
        count[hero.rank].push(hero._id);
        return count;
      },
      { S: [], A: [], B: [], C: [] }
    );

    const neededHeroesByDangerLevel =
      HEROES_NEEDED_BY_MONSTER_LEVEL[dangerLevel];

    const match = neededHeroesByDangerLevel.find(
      ({ rank, quantity }) => heroesByRank[rank].length >= quantity
    );

    if (match?.rank) {
      return heroesByRank[match.rank];
    }

    if (meters >= MAX_RANGE_IN_METERS) {
      return [];
    }

    return this.getHeroesIdNearFrom({
      latitude,
      longitude,
      dangerLevel,
      meters: meters * 2,
    });
  }

  async occurrence({ monsterName, dangerLevel, location }) {
    const { lat: latitude, lng: longitude } = location;

    const allocatedHeroesId = await this.getHeroesIdNearFrom({
      latitude,
      longitude,
      dangerLevel,
    });

    const monster = {
      name: monsterName,
      rank: dangerLevel,
      heroes: allocatedHeroesId,
      longitude,
      latitude,
      status: MONSTER_STATUS_NAMED.FREE,
    };

    if (allocatedHeroesId.length > 0) {
      monster.status = MONSTER_STATUS_NAMED.FIGHTING;
      await this.heroRepository.setManyAsFightingById(allocatedHeroesId);
    }

    await this.monsterRepository.create(monster);
  }
}
