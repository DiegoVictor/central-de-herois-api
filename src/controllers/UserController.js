import { User } from '../models/User';

class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        error: {
          message: 'Email already in use',
        },
      });
    }

    await User.create({ name, email, password });

    return res.sendStatus(201);
  }
}

export { UserController };
