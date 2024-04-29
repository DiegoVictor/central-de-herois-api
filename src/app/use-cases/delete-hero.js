import { failure } from '../contracts/failure';
import { success } from '../contracts/success';

export class DeleteHeroUseCase {
  constructor(heroRepository) {
    this.heroRepository = heroRepository;
  }

  async execute({ id }) {
    const hero = await this.heroRepository.findOneById(id);
    if (!hero) {
      return failure(404, 'Hero not found');
    }

    await this.heroRepository.deleteOneById(id);

    return success(null, 204);
  }
}
