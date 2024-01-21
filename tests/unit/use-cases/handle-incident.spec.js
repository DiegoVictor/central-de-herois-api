import { faker } from '@faker-js/faker';
import { HandleIncident } from '../../../src/app/use-cases/handle-incident';
import {
  MONSTER_RANK,
  MONSTER_STATUS_NAMED,
} from '../../../src/entities/monster';

describe('HandleIncident Use Case', () => {
  it('should be able to create the monster and set the hero in FIGHTING status', async () => {
    const heroRepository = { setManyAsFightingById: jest.fn() };
    const monsterRepository = { create: jest.fn() };
    const handleIncident = new HandleIncident(
      heroRepository,
      monsterRepository
    );

    const heroes = [{ _id: faker.string.uuid() }];
    const monster = {
      name: faker.person.fullName(),
      rank: faker.helpers.arrayElement(MONSTER_RANK),
      longitude: Number(faker.location.longitude()),
      latitude: Number(faker.location.latitude()),
      status: MONSTER_STATUS_NAMED.FIGHTING,
      heroes,
    };

    await handleIncident.execute({
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: {
        lat: monster.latitude,
        lng: monster.longitude,
      },
      heroes,
    });

    expect(heroRepository.setManyAsFightingById).toHaveBeenCalledWith(heroes);
    expect(monsterRepository.create).toHaveBeenCalledWith(monster);
  });

  it('should be able to create the monster and set it in FREE status', async () => {
    const heroRepository = { setManyAsFightingById: jest.fn() };
    const monsterRepository = { create: jest.fn() };
    const handleIncident = new HandleIncident(
      heroRepository,
      monsterRepository
    );

    const monster = {
      name: faker.person.fullName(),
      rank: faker.helpers.arrayElement(MONSTER_RANK),
      longitude: Number(faker.location.longitude()),
      latitude: Number(faker.location.latitude()),
      status: MONSTER_STATUS_NAMED.FREE,
      heroes: [],
    };

    await handleIncident.execute({
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: {
        lat: monster.latitude,
        lng: monster.longitude,
      },
      heroes: [],
    });

    expect(heroRepository.setManyAsFightingById).not.toHaveBeenCalled();
    expect(monsterRepository.create).toHaveBeenCalledWith(monster);
  });
});
