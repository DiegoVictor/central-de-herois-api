import { z } from 'zod';

import Hero from '../models/Hero';

class HeroController {
  async index(req, res) {
    const heroes = await Hero.find();
    return res.json(heroes);
  }

  async store(req, res) {
    const schema = z.object({
      name: z.string(),
      latitude: z.string().or(z.number()),
      longitude: z.string().or(z.number()),
      rank: z.enum(['S', 'A', 'B', 'C']),
      status: z.enum(['fighting', 'out_of_combat', 'patrolling', 'resting']),
    });

    const { name, latitude, longitude, rank, status, description } =
      schema.parse(req.body);

    if (!hero) {
      hero = await Hero.create({
        name,
        location: { type: 'Point', coordinates: [longitude, latitude] },
        rank,
        status,
        description,
      });
    }

    return res.json(hero);
  }

  async update(req, res) {
    const schema = z.object({
      name: z.string().nullable(),
      latitude: z.string().or(z.number()).nullable(),
      longitude: z.string().or(z.number()).nullable(),
      rank: z.enum(['S', 'A', 'B', 'C']).nullable(),
      status: z.enum(['fighting', 'out_of_combat', 'patrolling', 'resting'])
        .nullable,
    });

    const { id } = req.params;
    const { name, latitude, longitude } = schema.validate(req.body);

    const hero = await Hero.findById(id);
    if (!hero) {
      return res.status(404).json({
        error: {
          message: 'Hero not found',
        },
      });
    }

    if (typeof latitude !== 'undefined') {
      hero.location = {
        type: 'Point',
        coordinates: [hero.location.coordinates[0], latitude],
      };
    }

    if (typeof longitude !== 'undefined') {
      hero.location = {
        type: 'Point',
        coordinates: [longitude, hero.location.coordinates[1]],
      };
    }

    ['rank', 'status', 'description'].forEach(field => {
      if (typeof req.body[field] !== 'undefined') {
        hero[field] = req.body[field];
      }
    });

    if (typeof name === 'string' && name !== hero.name) {
      if (!(await Hero.findOne({ name }))) {
        hero.name = name;
      } else {
        return res.status(401).json({
          error: {
            message: 'Name already in use',
          },
        });
      }
    }

    await hero.save();

    return res.json(hero);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const hero = await Hero.findById(id);

    if (!hero) {
      return res.status(404).json({
        error: {
          message: 'Hero not found',
        },
      });
    }

    await hero.remove();

    return res.status(200).json({
      status: 'success',
    });
  }
}

export { HeroController };
