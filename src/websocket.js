import io from 'socket.io-client';

import { Monster } from './repositories/monster';
import { Hero } from './repositories/hero';
import {
  HEROES_NEEDED_BY_MONSTER_LEVEL,
  INITIAL_RANGE_IN_METERS,
} from './utils/constants';

const socket = io(process.env.MONSTER_WEBSOCKET, {
  autoConnect: false,
});

const getHeroesIdNearFrom = async ({
  latitude,
  longitude,
  meters = INITIAL_RANGE_IN_METERS,
  dangerLevel,
}) => {
  const heroes = await Hero.find({
    status: { $nin: ['fighting', 'out_of_combat'] },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: meters,
      },
    },
  });

  const heroesByRank = heroes.reduce(
    (count, hero) => {
      count[hero.rank].push(hero._id);
      return count;
    },
    { S: [], A: [], B: [], C: [] }
  );

  const neededHeroes = Object.keys(HEROES_NEEDED_BY_MONSTER_LEVEL[dangerLevel]);
  const matchedHeroRank = neededHeroes.find(
    ({ rank, quantity }) => heroesByRank[rank].length >= quantity
  );

  if (matchedHeroRank) {
    return heroesByRank[matchedHeroRank];
  }

  return getHeroesIdNearFrom(latitude, longitude, meters * 2, dangerLevel);
};

export const setupWebSocket = async () => {
  socket.connect();

  socket.on('occurrence', async ({ monsterName, dangerLevel, location }) => {
    const { lat, lng } = location.pop();
    const allocatedHeroesId = await getHeroesIdNearFrom({
      latitude: lat,
      longitude: lng,
      dangerLevel,
    });

    await Promise.all([
      Hero.updateMany(
        {
          _id: { $in: allocatedHeroesId },
        },
        {
          $set: {
            status: 'fighting',
          },
        }
      ),
      Monster.create({
        name: monsterName,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        rank: dangerLevel,
        heroes: allocatedHeroesId,
        status: 'fighting',
      }),
    ]);
  });
};
