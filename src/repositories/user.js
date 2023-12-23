import { model, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model('User', schema);

export class UserRepository {
  async create({ name, email, password }) {
    password = await bcryptjs.hash(password, 8);

    return User.create({ name, email, password });
  }

  async findOne(conditions) {
    return User.findOne(conditions);
  }
}
