import { MonsterRepository } from '../repositories/monster';
import { GetMonstersUseCase } from '../use-cases/get-monsters';
import { HttpResponse } from '../utils/either/parser';

class MonsterController {
  async index(req, res) {
    const { status } = req.query;

    const monsterRepository = new MonsterRepository();
    const getMonstersUseCase = new GetMonstersUseCase(monsterRepository);

    const result = await getMonstersUseCase.execute({ status });

    return HttpResponse.parse(result, res);
  }
}

export { MonsterController };
