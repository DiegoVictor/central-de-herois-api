import { failure } from '../contracts/failure';
import { success } from '../contracts/success';

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

    return success(null, 201);
  }
}
