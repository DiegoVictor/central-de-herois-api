import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcryptjs from 'bcryptjs';

import { app } from '../../../src/infra/http/app';
import { User } from '../../../src/infra/repositories/user';
import factory from '../../utils/factory';

describe('Session controller', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to login', async () => {
    const { name, email, password } = await factory.attrs('User');
    const hashedPassword = await bcryptjs.hash(password, 8);

    const user = await User.create({ name, email, password: hashedPassword });

    const { body } = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(body).toMatchObject({
      user: { _id: user._id.toString(), email, name },
      token: expect.any(String),
    });
  });

  it('should not be able to login with user that not exists', async () => {
    const { email, password } = await factory.attrs('User');
    const { body } = await request(app)
      .post('/sessions')
      .expect(404)
      .send({ email, password });

    expect(body).toStrictEqual({
      message: 'User does not exists',
    });
  });

  it('should not be able to login', async () => {
    const wrongPassword = faker.internet.password();
    const { name, email, password } = await factory.attrs('User');

    const hashedPassword = await bcryptjs.hash(password, 8);
    await User.create({ name, email, password: hashedPassword });

    const { body } = await request(app)
      .post('/sessions')
      .expect(400)
      .send({ email, password: wrongPassword });

    expect(body).toMatchObject({
      message: 'User and/or password does not match',
    });
  });
});
