import { UserRepository } from '../repositories/user';
import { AuthenticateUseCase } from '../use-cases/authenticate';
import { HttpResponse } from '../utils/either/parser';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const userRepository = new UserRepository();
    const authenticateUseCase = new AuthenticateUseCase(userRepository);

    const result = await authenticateUseCase.execute({ email, password });

    return HttpResponse.parse(result, res);
  }
}

export { SessionController };
