import { success } from '../utils/either/success';

export class CreateHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute({ name, latitude, longitude, rank, status, description }) {
    await this.heroRepository.findOneAndUpdate(
      {
        name,
      },
      {
        name,
        location: { type: 'Point', coordinates: [longitude, latitude] },
        rank,
        status,
        description,
      },
      {
        upsert: true,
      }
    );

    return success(null, 201);
  }
}
