import request from 'supertest';
import Mongoose from 'mongoose';

import { app } from '../../../src/infra/http/app';
import { Hero } from '../../../src/infra/repositories/hero';
import { Monster } from '../../../src/infra/repositories/monster';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';
import { HERO_STATUS_NAMED } from '../../../src/entities/hero';

let token;

describe('Defeated controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Hero.deleteMany();
    await Monster.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to set a monster as defeated', async () => {
    const { _id } = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    await request(app)
      .put(`/monsters/${_id}/defeated`)
      .set('Authorization', token)
      .expect(204)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: HERO_STATUS_NAMED.RESTING,
          },
        ],
      });

    expect(await Hero.findById(hero._id)).toMatchObject({
      status: HERO_STATUS_NAMED.RESTING,
    });
  });

  it('should not be able to set a monster that not exists as defeated', async () => {
    const monster = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    await Monster.deleteOne({ _id: monster._id });

    const { body } = await request(app)
      .put(`/monsters/${monster._id}/defeated`)
      .set('Authorization', token)
      .expect(404)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: HERO_STATUS_NAMED.RESTING,
          },
        ],
      });

    expect(body).toStrictEqual({
      message: 'Monster not found',
    });
  });

  it('should not be able to set a monster as defeated by hero that not exists', async () => {
    const monster = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    await Hero.deleteOne({ _id: hero._id });

    const { body } = await request(app)
      .put(`/monsters/${monster._id}/defeated`)
      .set('Authorization', token)
      .expect(404)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: HERO_STATUS_NAMED.RESTING,
          },
        ],
      });

    expect(body).toStrictEqual({
      message: 'Hero not found',
    });
  });
});
