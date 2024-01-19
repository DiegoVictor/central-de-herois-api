import { MonsterRepository } from '../../repositories/monster';
import { HeroRepository } from '../../repositories/hero';
import { UpdateCombatStatusUseCase } from '../../../app/use-cases/update-combat-status';
import { HttpResponse } from '../parser/either';
import { heroValidators } from '../../../app/validators/hero';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const { heroes } = heroValidators.defeated(req.body);

    const heroRepository = new HeroRepository();
    const monsterRepository = new MonsterRepository();
    const updateCombatStatusUseCase = new UpdateCombatStatusUseCase(
      heroRepository,
      monsterRepository
    );

    const result = await updateCombatStatusUseCase.execute({ id, heroes });

    return HttpResponse.parse(result, res);
  }
}

export { DefeatedController };
