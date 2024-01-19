import { UserRepository } from '../../repositories/user';
import { CreateUserUseCase } from '../../../app/use-cases/create-user';
import { HttpResponse } from '../parser/either';
import { userValidators } from '../../../app/validators/user';

class UserController {
  async store(req, res) {
    const { name, email, password } = userValidators.store(req.body);

    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const result = await createUserUseCase.execute({ name, email, password });

    return HttpResponse.parse(result, res);
  }
}

export { UserController };
