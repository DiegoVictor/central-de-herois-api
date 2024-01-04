import { z } from 'zod';

import { MonsterRepository } from '../repositories/monster';
import { HeroRepository } from '../repositories/hero';
import { UpdateCombatStatusUseCase } from '../use-cases/update-combat-status';
import { HttpResponse } from '../utils/either/parser';
import { HERO_STATUS } from '../utils/constants';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const { heroes } = z
      .object({
        heroes: z.array(
          z.object({
            _id: z.string(0),
            status: z.enum(HERO_STATUS),
          })
        ),
      })
      .parse(req.body);

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
