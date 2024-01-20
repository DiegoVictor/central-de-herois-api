export const INITIAL_RANGE_IN_METERS = 10000;
export const MAX_RANGE_IN_METERS = 100000;

export const HERO_STATUS = [
  'fighting',
  'out_of_combat',
  'patrolling',
  'resting',
];

export const HERO_STATUS_NAMED = {
  FIGHTING: 'fighting',
  OUT_OF_COMBAT: 'out_of_combat',
  PATROLLING: 'patrolling',
  RESTING: 'resting',
};

export const HERO_RANK = ['S', 'A', 'B', 'C'];

export const HERO_RANK_NAMED = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
};

export const HEROES_NEEDED_BY_MONSTER_LEVEL = {
  God: [
    {
      rank: 'S',
      quantity: 1,
    },
    {
      rank: 'A',
      quantity: 2,
    },
    {
      rank: 'B',
      quantity: 4,
    },
    {
      rank: 'C',
      quantity: 8,
    },
  ],
  Dragon: [
    {
      rank: 'A',
      quantity: 1,
    },
    {
      rank: 'S',
      quantity: 1,
    },
    {
      rank: 'B',
      quantity: 2,
    },
    {
      rank: 'C',
      quantity: 4,
    },
  ],
  Tiger: [
    {
      rank: 'B',
      quantity: 1,
    },
    {
      rank: 'A',
      quantity: 1,
    },
    {
      rank: 'S',
      quantity: 1,
    },
    {
      rank: 'C',
      quantity: 2,
    },
  ],
  Wolf: [
    {
      rank: 'C',
      quantity: 1,
    },
    {
      rank: 'B',
      quantity: 1,
    },
    {
      rank: 'A',
      quantity: 1,
    },
    {
      rank: 'S',
      quantity: 1,
    },
  ],
};
