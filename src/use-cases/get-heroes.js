import { success } from '../utils/either/success';

export class GetHeroesUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute() {
    const heroes = await this.heroRepository.findMany();

    return success(
      heroes.map(
        ({
          _id,
          name,
          status,
          rank,
          description,
          location: {
            coordinates: [longitude, latitude],
          },
        }) => ({
          _id,
          name,
          status,
          rank,
          description,
          longitude,
          latitude,
        })
      )
    );
  }
}
