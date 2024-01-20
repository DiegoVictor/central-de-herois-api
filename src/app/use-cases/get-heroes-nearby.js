import {
  HEROES_NEEDED_BY_MONSTER_LEVEL,
  INITIAL_RANGE_IN_METERS,
  MAX_RANGE_IN_METERS,
} from '../../entities/hero';

export class GetHeroesNearby {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute({ location, dangerLevel, meters = INITIAL_RANGE_IN_METERS }) {
    const { lat: latitude, lng: longitude } = location;

    if (meters >= MAX_RANGE_IN_METERS) {
      return [];
    }

    const heroes = await this.heroRepository.findReadyForCombatNearby({
      longitude,
      latitude,
      meters,
    });

    if (heroes.length > 0) {
      const byRank = heroes.reduce(
        (agg, hero) => {
          agg[hero.rank].push(hero._id);
          return agg;
        },
        { S: [], A: [], B: [], C: [] }
      );

      const neededHeroesByDangerLevel =
        HEROES_NEEDED_BY_MONSTER_LEVEL[dangerLevel];
      const match = neededHeroesByDangerLevel.find(
        ({ rank, quantity }) => byRank[rank].length >= quantity
      );

      if (match?.rank) {
        return byRank[match.rank];
      }
    }

    return this.execute({
      location,
      dangerLevel,
      meters: meters * 2,
    });
  }
}
