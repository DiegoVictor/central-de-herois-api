import { failure } from '../utils/either/failure';
import { success } from '../utils/either/success';

export class UpdateHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute(payload) {
    const { id, name, latitude, longitude } = payload;

    const hero = await this.heroRepository.findOneById(id);
    if (!hero) {
      return failure(404, 'Hero not found');
    }

    const { coordinates } = hero.location;
    if (latitude) {
      hero.location = {
        type: 'Point',
        coordinates: [coordinates[0], latitude],
      };
    }

    if (longitude) {
      hero.location = {
        type: 'Point',
        coordinates: [longitude, coordinates[1]],
      };
    }

    ['rank', 'status', 'description'].forEach((field) => {
      if (payload[field]) {
        hero[field] = payload[field];
      }
    });

    if (name && name !== hero.name) {
      const existingHero = await this.heroRepository.findOneByName({ name });
      if (existingHero) {
        return failure(401, 'Name already in use');
      }

      hero.name = name;
    }

    await hero.save();

    return success(null, 204);
  }
}
