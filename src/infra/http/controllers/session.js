import { UserRepository } from '../../repositories/user';
import { AuthenticateUseCase } from '../../../app/use-cases/authenticate';
import { HttpResponse } from '../parser/either';
import { sessionValidators } from '../../../app/validators/session';

class SessionController {
  async store(req, res) {
    const { email, password } = sessionValidators.store(req.body);

    const userRepository = new UserRepository();
    const authenticateUseCase = new AuthenticateUseCase(userRepository);

    const result = await authenticateUseCase.execute({ email, password });

    return HttpResponse.parse(result, res);
  }
}

export { SessionController };
