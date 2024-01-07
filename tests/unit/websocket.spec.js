import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';

import { MonsterWebSocket } from '../../src/websocket';
import {
  HERO_RANK_NAMED,
  INITIAL_RANGE_IN_METERS,
  MONSTER_RANK,
  MONSTER_STATUS,
  MONSTER_STATUS_NAMED,
} from '../../src/utils/constants';
import factory from '../utils/factory';

const mockIo = jest.fn();
jest.mock('socket.io-client', () => ({
  io: (uri, opts) => mockIo(uri, opts),
}));

describe('Monster websocket', () => {
  it('should be able to handle a new incident with a S-ranked hero', async () => {
    const cbs = [];
    const socket = {
      connect: jest.fn(),
      on: jest.fn(async (_, cb) => {
        cbs.push(cb);
      }),
    };
    mockIo.mockReturnValueOnce(socket);

    const monster = {
      name: faker.person.fullName(),
      location: {
        type: 'Point',
        coordinates: [
          Number(faker.location.longitude()),
          Number(faker.location.latitude()),
        ],
      },
      status: faker.helpers.arrayElement(MONSTER_STATUS),
      rank: faker.helpers.arrayElement(MONSTER_RANK),
    };
    const hero = await factory.attrs('Hero', {
      rank: HERO_RANK_NAMED.S,
      _id: randomUUID,
    });

    const heroRepository = {
      findReadyForCombatNearFrom: jest.fn().mockResolvedValueOnce([hero]),
      setManyAsFightingById: jest.fn(),
    };
    const monsterRepository = {
      create: jest.fn(),
    };

    const monsterWebSocket = new MonsterWebSocket(
      monsterRepository,
      heroRepository
    );

    monsterWebSocket.setup();

    const [lng, lat] = monster.location.coordinates;
    const monsterEvent = {
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: {
        lat,
        lng,
      },
    };
    await cbs.pop()(monsterEvent);

    expect(mockIo).toHaveBeenCalledWith(process.env.MONSTER_WEBSOCKET, {
      autoConnect: false,
    });
    expect(socket.connect).toHaveBeenCalled();
    expect(socket.on).toHaveBeenCalledWith('occurrence', expect.any(Function));
    expect(heroRepository.findReadyForCombatNearFrom).toHaveBeenCalledWith({
      longitude: lng,
      latitude: lat,
      meters: INITIAL_RANGE_IN_METERS,
    });
    expect(monsterRepository.create).toHaveBeenCalledWith({
      name: monster.name,
      rank: monster.rank,
      heroes: [hero._id],
      latitude: lat,
      longitude: lng,
      status: MONSTER_STATUS_NAMED.FIGHTING,
    });
    expect(heroRepository.setManyAsFightingById).toHaveBeenCalledWith([
      hero._id,
    ]);
  });

  it('should be able to handle a new incident with non S-ranked heroes', async () => {
    const cbs = [];
    const socket = {
      connect: jest.fn(),
      on: jest.fn(async (_, cb) => {
        cbs.push(cb);
      }),
    };
    mockIo.mockReturnValueOnce(socket);

    const monster = {
      name: faker.person.fullName(),
      location: {
        type: 'Point',
        coordinates: [
          Number(faker.location.longitude()),
          Number(faker.location.latitude()),
        ],
      },
      status: faker.helpers.arrayElement(MONSTER_STATUS),
      rank: faker.helpers.arrayElement(MONSTER_RANK),
    };
    const heroes = await factory.attrsMany('Hero', 2, {
      rank: HERO_RANK_NAMED.A,
      _id: randomUUID,
    });

    const heroRepository = {
      findReadyForCombatNearFrom: jest
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(heroes),
      setManyAsFightingById: jest.fn(),
    };
    const monsterRepository = {
      create: jest.fn(),
    };

    const monsterWebSocket = new MonsterWebSocket(
      monsterRepository,
      heroRepository
    );

    monsterWebSocket.setup();

    const [lng, lat] = monster.location.coordinates;
    const monsterEvent = {
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: {
        lat,
        lng,
      },
    };
    await cbs.pop()(monsterEvent);

    expect(mockIo).toHaveBeenCalledWith(process.env.MONSTER_WEBSOCKET, {
      autoConnect: false,
    });
    expect(socket.connect).toHaveBeenCalled();
    expect(socket.on).toHaveBeenCalledWith('occurrence', expect.any(Function));
    expect(heroRepository.findReadyForCombatNearFrom).toHaveBeenCalledWith({
      longitude: lng,
      latitude: lat,
      meters: INITIAL_RANGE_IN_METERS,
    });

    const heroesId = heroes.map(({ _id }) => _id);
    expect(monsterRepository.create).toHaveBeenCalledWith({
      name: monster.name,
      rank: monster.rank,
      heroes: heroesId,
      latitude: lat,
      longitude: lng,
      status: MONSTER_STATUS_NAMED.FIGHTING,
    });
    expect(heroRepository.setManyAsFightingById).toHaveBeenCalledWith(heroesId);
  });

  it('should not be able to allocate heroes to fight', async () => {
    const cbs = [];
    const socket = {
      connect: jest.fn(),
      on: jest.fn(async (_, cb) => {
        cbs.push(cb);
      }),
    };
    mockIo.mockReturnValueOnce(socket);

    const monster = {
      name: faker.person.fullName(),
      location: {
        type: 'Point',
        coordinates: [
          Number(faker.location.longitude()),
          Number(faker.location.latitude()),
        ],
      },
      status: faker.helpers.arrayElement(MONSTER_STATUS),
      rank: faker.helpers.arrayElement(MONSTER_RANK),
    };

    const heroRepository = {
      findReadyForCombatNearFrom: jest.fn().mockResolvedValue([]),
      setManyAsFightingById: jest.fn(),
    };
    const monsterRepository = {
      create: jest.fn(),
    };

    const monsterWebSocket = new MonsterWebSocket(
      monsterRepository,
      heroRepository
    );

    monsterWebSocket.setup();

    const [lng, lat] = monster.location.coordinates;
    const monsterEvent = {
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: {
        lat,
        lng,
      },
    };
    await cbs.pop()(monsterEvent);

    expect(mockIo).toHaveBeenCalledWith(process.env.MONSTER_WEBSOCKET, {
      autoConnect: false,
    });
    expect(socket.connect).toHaveBeenCalled();
    expect(socket.on).toHaveBeenCalledWith('occurrence', expect.any(Function));
    expect(heroRepository.findReadyForCombatNearFrom).toHaveBeenCalledWith({
      longitude: lng,
      latitude: lat,
      meters: INITIAL_RANGE_IN_METERS,
    });

    expect(monsterRepository.create).toHaveBeenCalledWith({
      name: monster.name,
      rank: monster.rank,
      heroes: [],
      latitude: lat,
      longitude: lng,
      status: MONSTER_STATUS_NAMED.FREE,
    });
  });
});
