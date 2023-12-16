import { z } from 'zod';

import { Hero } from '../models/Hero';

class HeroController {
  async index(_, res) {
    const heroes = await Hero.find();
    return res.json(heroes);
  }

  async store(req, res) {
    const { name, latitude, longitude, rank, status, description } = z
      .object({
        name: z.string(),
        latitude: z.string().or(z.number()),
        longitude: z.string().or(z.number()),
        rank: z.enum(['S', 'A', 'B', 'C']),
        status: z.enum(['fighting', 'out_of_combat', 'patrolling', 'resting']),
        description: z.string(),
      })
      .parse(req.body);

    await Hero.findOneAndUpdate(
      {
        name,
      },
      {
        name,
        location: { type: 'Point', coordinates: [longitude, latitude] },
        rank,
        status,
        description,
      },
      {
        upsert: true,
      }
    );

    return res.json({
      name,
      latitude,
      longitude,
      rank,
      status,
      description,
    });
  }

  async update(req, res) {
    const { name, latitude, longitude } = z
      .object({
        name: z.string().optional(),
        latitude: z.string().or(z.number()).optional(),
        longitude: z.string().or(z.number()).optional(),
        rank: z.enum(['S', 'A', 'B', 'C']).optional(),
        status: z
          .enum(['fighting', 'out_of_combat', 'patrolling', 'resting'])
          .optional(),
        description: z.string().optional(),
      })
      .parse(req.body);

    const { id } = req.params;

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

    ['rank', 'status', 'description'].forEach((field) => {
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
