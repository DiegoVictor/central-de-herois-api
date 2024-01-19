import { HeroRepository } from '../../repositories/hero';
import { HttpResponse } from '../parser/either';
import { CreateHeroUseCase } from '../../../app/use-cases/create-hero';
import { UpdateHeroUseCase } from '../../../app/use-cases/update-hero';
import { DeleteHeroUseCase } from '../../../app/use-cases/delete-hero';
import { GetHeroesUseCase } from '../../../app/use-cases/get-heroes';
import { heroValidators } from '../../../app/validators/hero';

class HeroController {
  async index(_, res) {
    const heroRepository = new HeroRepository();
    const getHeroesUseCase = new GetHeroesUseCase(heroRepository);

    const result = await getHeroesUseCase.execute();

    return HttpResponse.parse(result, res);
  }

  async store(req, res) {
    const { name, latitude, longitude, rank, status, description } =
      heroValidators.store(req.body);

    const heroRepository = new HeroRepository();
    const createHeroUseCase = new CreateHeroUseCase(heroRepository);

    const result = await createHeroUseCase.execute({
      name,
      latitude,
      longitude,
      rank,
      status,
      description,
    });

    return HttpResponse.parse(result, res);
  }

  async update(req, res) {
    const { name, rank, status, description, latitude, longitude } =
      heroValidators.update(req.body);

    const { id } = req.params;

    const heroRepository = new HeroRepository();
    const updateHeroUseCase = new UpdateHeroUseCase(heroRepository);

    const result = await updateHeroUseCase.execute({
      id,
      name,
      rank,
      status,
      description,
      latitude,
      longitude,
    });

    return HttpResponse.parse(result, res);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const heroRepository = new HeroRepository();
    const deleteHeroUseCase = new DeleteHeroUseCase(heroRepository);

    const result = await deleteHeroUseCase.execute({ id });

    return HttpResponse.parse(result, res);
  }
}

export { HeroController };
