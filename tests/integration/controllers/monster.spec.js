import request from 'supertest';
import Mongoose from 'mongoose';

import { app } from '../../../src/app';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';
import { Monster } from '../../../src/models/Monster';

let token;

describe('Monster controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Monster.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of monsters', async () => {
    const monsters = await factory.createMany('Monster', 3);
    const { body } = await request(app)
      .get('/monsters')
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();
    monsters.forEach((monster) => {
      const {
        _id,
        name,
        heroes,
        rank,
        location: {
          coordinates: [longitude, latitude],
        },
        status,
      } = monster;

      expect(body).toContainEqual(
        expect.objectContaining({
          _id: _id.toString(),
          name,
          heroes: heroes.map((hero) =>
            expect.objectContaining({
              _id: hero._id.toString(),
            })
          ),
          rank,
          longitude,
          latitude,
          status,
        })
      );
    });
  });

  it('should be able to get a list of defeated monsters', async () => {
    const status = 'defeated';
    const monsters = await factory.createMany('Monster', 3, [
      { status },
      { status: 'fighting' },
      { status: 'free' },
    ]);

    const { body } = await request(app)
      .get(`/monsters?status=${status}`)
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();

    const [
      {
        _id,
        name,
        heroes,
        rank,
        location: {
          coordinates: [longitude, latitude],
        },
      },
    ] = monsters;

    expect(body).toContainEqual(
      expect.objectContaining({
        _id: _id.toString(),
        name,
        heroes: heroes.map((hero) =>
          expect.objectContaining({
            _id: hero._id.toString(),
          })
        ),
        status,
        rank,
        longitude,
        latitude,
      })
    );
  });
});
