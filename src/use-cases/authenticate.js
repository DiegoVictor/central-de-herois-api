import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { failure } from '../utils/either/failure';
import { success } from '../utils/either/success';

export class AuthenticateUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return failure(404, 'User not exists');
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      return failure(400, 'User and/or password not match');
    }

    return success({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}
