import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { app } from '../../../src/app';

describe('Auth middleware', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should not be able to request without a token', async () => {
    const { body } = await request(app).get('/heros').expect(400).send();

    expect(body).toStrictEqual({
      error: {
        message: 'Missing authorization token',
      },
    });
  });

  it('should not be able to request with a invalid token', async () => {
    const id = faker.number.int();
    const { body } = await request(app)
      .get('/heros')
      .set(
        'Authorization',
        `Bearer ${jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: '-1d',
        })}`
      )
      .expect(401)
      .send();

    expect(body).toStrictEqual({
      error: {
        message: 'Token expired or invalid',
      },
    });
  });
});
