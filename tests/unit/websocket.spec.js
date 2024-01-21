import { faker } from '@faker-js/faker';

import { MonsterWebSocket } from '../../src/infra/websocket';
import { MONSTER_RANK, MONSTER_STATUS } from '../../src/entities/monster';

const mockIo = jest.fn();
jest.mock('socket.io-client', () => ({
  io: (uri, opts) => mockIo(uri, opts),
}));

jest.mock('../../src/infra/repositories/hero', () => ({
  ...jest.requireActual('../../src/infra/repositories/hero'),
  HeroRepository: function HeroRepository() {
    return {};
  },
}));

jest.mock('../../src/infra/repositories/monster', () => ({
  ...jest.requireActual('../../src/infra/repositories/monster'),
  MonsterRepository: function MonsterRepository() {
    return {};
  },
}));

const mockHandleIncidentExecute = jest.fn();
jest.mock('../../src/app/use-cases/handle-incident', () => ({
  HandleIncident: function HandleIncident() {
    return { execute: mockHandleIncidentExecute };
  },
}));

const mockGetHeroesNearbyExecute = jest.fn();
jest.mock('../../src/app/use-cases/get-heroes-nearby', () => ({
  GetHeroesNearby: function GetHeroesNearby() {
    return { execute: mockGetHeroesNearbyExecute };
  },
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

    const heroes = [faker.string.uuid()];
    mockGetHeroesNearbyExecute.mockResolvedValueOnce(heroes);

    const monsterWebSocket = new MonsterWebSocket();

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
    expect(socket.on).toHaveBeenCalledWith('incident', expect.any(Function));
    expect(mockGetHeroesNearbyExecute).toHaveBeenCalledWith({
      location: { lat, lng },
      dangerLevel: monster.rank,
    });
    expect(mockHandleIncidentExecute).toHaveBeenCalledWith({
      monsterName: monster.name,
      dangerLevel: monster.rank,
      location: { lat, lng },
      heroes,
    });
  });
});
