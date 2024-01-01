import { failure } from '../utils/either/failure';
import { success } from '../utils/either/success';

export class DeleteHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute({ id }) {
    const hero = await this.heroRepository.findById(id);
    if (!hero) {
      return failure(404, 'Hero not found');
    }

    await hero.remove();

    return success(null, 204);
  }
}
