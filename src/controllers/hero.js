import { z } from 'zod';

import { HeroRepository } from '../repositories/hero';
import { HttpResponse } from '../utils/either/parser';
import { CreateHeroUseCase } from '../use-cases/create-hero';
import { UpdateHeroUseCase } from '../use-cases/update-hero';
import { DeleteHeroUseCase } from '../use-cases/delete-hero';
import { GetHeroesUseCase } from '../use-cases/get-heroes';
import { HERO_RANK, HERO_STATUS } from '../utils/constants';

class HeroController {
  async index(_, res) {
    const heroRepository = new HeroRepository();
    const getHeroesUseCase = new GetHeroesUseCase(heroRepository);

    const result = await getHeroesUseCase.execute();

    return HttpResponse.parse(result, res);
  }

  async store(req, res) {
    const { name, latitude, longitude, rank, status, description } = z
      .object({
        name: z.string(),
        latitude: z.string().or(z.number()),
        longitude: z.string().or(z.number()),
        rank: z.enum(HERO_RANK),
        status: z.enum(HERO_STATUS),
        description: z.string(),
      })
      .parse(req.body);

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
    const { name, rank, status, description, latitude, longitude } = z
      .object({
        name: z.string().optional(),
        latitude: z.string().or(z.number()).optional(),
        longitude: z.string().or(z.number()).optional(),
        rank: z.enum(HERO_RANK).optional(),
        status: z.enum(HERO_STATUS).optional(),
        description: z.string().optional(),
      })
      .parse(req.body);

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
