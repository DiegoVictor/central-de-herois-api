import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../../src/infra/http/app';
import { Hero } from '../../../src/infra/repositories/hero';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';

let token;

describe('Hero controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Hero.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to get a list of heroes', async () => {
    const heroes = await factory.createMany('Hero', 3);
    const { body } = await request(app)
      .get('/heroes')
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();

    heroes.forEach(({ _id, name, status, rank, description, location }) => {
      expect(body).toContainEqual(
        expect.objectContaining({
          _id: _id.toString(),
          name,
          status,
          rank,
          description,
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
        })
      );
    });
  });

  it('should be able to store a new heroes', async () => {
    const { name, status, rank, location, description } =
      await factory.attrs('Hero');

    await request(app)
      .post('/heroes')
      .set('Authorization', token)
      .expect(201)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });
  });

  it('should be able to update an hero', async () => {
    const hero = await factory.create('Hero');
    const { name, status, rank, location, description } =
      await factory.attrs('Hero');

    await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(204)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });
  });

  it('should not be able to update an hero that not exists', async () => {
    const hero = await factory.create('Hero');
    const { name, status, rank, location, description } =
      await factory.attrs('Hero');

    await Hero.deleteOne({ _id: hero._id });

    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(404)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });

    expect(body).toStrictEqual({
      message: 'Hero not found',
    });
  });

  it('should not be able to update an hero with a name already in use', async () => {
    const [hero, { name }] = await factory.createMany('Hero', 2);

    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(401)
      .send({ name });

    expect(body).toStrictEqual({
      message: 'Name already in use',
    });
  });

  it('should be able to delete an hero', async () => {
    const hero = await factory.create('Hero');

    await request(app)
      .delete(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(204)
      .send();
  });

  it('should not be able to delete an hero that not exists', async () => {
    const hero = await factory.create('Hero');

    await Hero.deleteOne({ _id: hero._id });

    const { body } = await request(app)
      .delete(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(404)
      .send();

    expect(body).toStrictEqual({
      message: 'Hero not found',
    });
  });
});
