import { MONSTER_STATUS_NAMED } from '../../entities/monster';
import { failure } from '../contracts/failure';
import { success } from '../contracts/success';

export class UpdateCombatStatusUseCase {
  constructor(heroRepository, monsterRepository) {
    this.heroRepository = heroRepository;
    this.monsterRepository = monsterRepository;
  }

  async execute({ id, heroes }) {
    const monster = await this.monsterRepository.findById(id);

    if (!monster) {
      return failure(404, 'Monster not found');
    }

    const heroesId = heroes.map(({ _id }) => _id);
    const existingHeroes = await this.heroRepository.findMany(heroesId);

    if (existingHeroes.length !== heroesId.length) {
      return failure(404, 'Hero not found');
    }

    await Promise.all(
      existingHeroes.map((hero) => {
        const heroAfterCombat = heroes.find(
          ({ _id }) => _id === hero._id.toString()
        );

        hero.status = heroAfterCombat.status;
        monster.heroes.push(hero._id);

        return hero.save();
      })
    );

    monster.status = MONSTER_STATUS_NAMED.DEFEATED;
    await monster.save();

    return success(null, 204);
  }
}
