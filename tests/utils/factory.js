import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import { HERO_RANK, HERO_STATUS } from '../../src/entities/hero';
import { MONSTER_RANK, MONSTER_STATUS } from '../../src/entities/monster';

factory.define('Hero', Hero, {
  name: faker.person.firstName,
  description: faker.lorem.paragraph,
  location: () => ({
    type: 'Point',
    coordinates: [
      Number(faker.location.longitude()),
      Number(faker.location.latitude()),
    ],
  }),
  rank: () => faker.helpers.arrayElement(HERO_RANK),
  status: () => faker.helpers.arrayElement(HERO_STATUS),
});

factory.define('Monster', Monster, async () => {
  const hero = await factory.create('Hero', { rank: 'S' });
  return {
    name: faker.person.fullName,
    location: () => ({
      type: 'Point',
      coordinates: [
        Number(faker.location.longitude()),
        Number(faker.location.latitude()),
      ],
    }),
    heroes: [hero],
    status: () => faker.helpers.arrayElement(MONSTER_STATUS),
    rank: () => faker.helpers.arrayElement(MONSTER_RANK),
  };
});

factory.define('User', User, {
  name: faker.person.fullName,
  email: faker.internet.email,
  password: faker.internet.password,
});

export default factory;
