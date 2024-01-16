import { z } from 'zod';

import { UserRepository } from '../repositories/user';
import { CreateUserUseCase } from '../use-cases/create-user';
import { HttpResponse } from '../utils/either/parser';

class UserController {
  async store(req, res) {
    const { name, email, password } = z
      .object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
      .parse(req.body);

    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const result = await createUserUseCase.execute({ name, email, password });

    return HttpResponse.parse(result, res);
  }
}

export { UserController };
