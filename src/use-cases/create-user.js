import { failure } from '../utils/either/failure';
import { success } from '../utils/either/success';

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return failure(401, 'Email already in use');
    }

    await this.userRepository.create({ name, email, password });

    return success();
  }
}
