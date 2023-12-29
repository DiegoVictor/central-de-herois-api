import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import { Hero } from '../../src/repositories/hero';
import { Monster } from '../../src/repositories/monster';
import { User } from '../../src/repositories/user';

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
  rank: () => faker.helpers.arrayElement(['S', 'A', 'B', 'C']),
  status: () =>
    faker.helpers.arrayElement([
      'fighting',
      'out_of_combat',
      'patrolling',
      'resting',
    ]),
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
    status: () => faker.helpers.arrayElement(['fighting', 'defeated', 'free']),
    rank: faker.helpers.arrayElement(['God', 'Dragon', 'Tiger', 'Wolf']),
  };
});

factory.define('User', User, {
  name: faker.person.fullName,
  email: faker.internet.email,
  password: faker.internet.password,
});

export default factory;
