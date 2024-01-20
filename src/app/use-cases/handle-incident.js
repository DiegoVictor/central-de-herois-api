import { MONSTER_STATUS_NAMED } from '../../entities/monster';

export class HandleIncident {
  constructor(heroRepository, monsterRepository) {
    this.heroRepository = heroRepository;
    this.monsterRepository = monsterRepository;
  }

  async execute({ monsterName, dangerLevel, location, heroes }) {
    const { lat: latitude, lng: longitude } = location;
    const monster = {
      name: monsterName,
      rank: dangerLevel,
      heroes,
      longitude,
      latitude,
      status: MONSTER_STATUS_NAMED.FREE,
    };

    if (heroes.length > 0) {
      monster.status = MONSTER_STATUS_NAMED.FIGHTING;
      await this.heroRepository.setManyAsFightingById(heroes);
    }

    await this.monsterRepository.create(monster);
  }
}
