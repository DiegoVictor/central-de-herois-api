import { faker } from '@faker-js/faker';
import { GetHeroesNearby } from '../../../src/app/use-cases/get-heroes-nearby';
import {
  HERO_RANK_NAMED,
  INITIAL_RANGE_IN_METERS,
  MAX_RANGE_IN_METERS,
} from '../../../src/entities/hero';
import { MONSTER_RANK } from '../../../src/entities/monster';

describe('GetHeroesNearby Use Case', () => {
  it('should be able to get S-ranked hero nearby', async () => {
    const hero = {
      _id: faker.string.uuid(),
      rank: HERO_RANK_NAMED.S,
    };
    const heroRepository = {
      findReadyForCombatNearby: jest.fn().mockResolvedValueOnce([hero]),
    };
    const getHeroesNearby = new GetHeroesNearby(heroRepository);

    const lng = Number(faker.location.longitude());
    const lat = Number(faker.location.latitude());
    const params = {
      dangerLevel: faker.helpers.arrayElement(MONSTER_RANK),
      location: {
        lat,
        lng,
      },
    };

    const response = await getHeroesNearby.execute(params);

    expect(heroRepository.findReadyForCombatNearby).toHaveBeenCalledWith({
      longitude: lng,
      latitude: lat,
      meters: INITIAL_RANGE_IN_METERS,
    });
    expect(response).toContainEqual(hero._id);
  });

  it('should be able to get A-ranked heroes nearby', async () => {
    const heroes = [
      {
        _id: faker.string.uuid(),
        rank: HERO_RANK_NAMED.A,
      },
      {
        _id: faker.string.uuid(),
        rank: HERO_RANK_NAMED.A,
      },
    ];
    const heroRepository = {
      findReadyForCombatNearby: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(heroes),
    };
    const getHeroesNearby = new GetHeroesNearby(heroRepository);

    const lng = Number(faker.location.longitude());
    const lat = Number(faker.location.latitude());
    const params = {
      dangerLevel: faker.helpers.arrayElement(MONSTER_RANK),
      location: {
        lat,
        lng,
      },
    };

    const response = await getHeroesNearby.execute(params);

    expect(heroRepository.findReadyForCombatNearby).toHaveBeenCalledWith({
      longitude: lng,
      latitude: lat,
      meters: INITIAL_RANGE_IN_METERS * 2,
    });
    heroes.forEach(({ _id }) => {
      expect(response).toContainEqual(_id);
    });
  });

  it('should not be able to get heroes nearby', async () => {
    const heroRepository = {
      findReadyForCombatNearby: jest.fn(),
    };
    const getHeroesNearby = new GetHeroesNearby(heroRepository);

    const lng = Number(faker.location.longitude());
    const lat = Number(faker.location.latitude());
    const params = {
      dangerLevel: faker.helpers.arrayElement(MONSTER_RANK),
      location: {
        lat,
        lng,
      },
      meters: MAX_RANGE_IN_METERS,
    };

    const response = await getHeroesNearby.execute(params);

    expect(response).toStrictEqual([]);
  });
});
