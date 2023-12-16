import { z } from 'zod';

import { Hero } from '../models/Hero';

class HeroController {
  async index(_, res) {
    const heroes = await Hero.find();

    return res.json(
      heroes.map(
        ({
          name,
          status,
          rank,
          description,
          location: {
            coordinates: [longitude, latitude],
          },
        }) => ({
          name,
          status,
          rank,
          description,
          longitude,
          latitude,
        })
      )
    );
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

    return res.sendStatus(201);
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

    const { coordinates } = hero.location;
    if (latitude) {
      hero.location = {
        type: 'Point',
        coordinates: [coordinates[0], latitude],
      };
    }

    if (longitude) {
      hero.location = {
        type: 'Point',
        coordinates: [longitude, coordinates[1]],
      };
    }

    ['rank', 'status', 'description'].forEach((field) => {
      if (req.body[field]) {
        hero[field] = req.body[field];
      }
    });

    if (name && name !== hero.name) {
      const existingHero = await Hero.findOne({ name });
      if (existingHero) {
        return res.status(401).json({
          error: {
            message: 'Name already in use',
          },
        });
      }

      hero.name = name;
    }

    await hero.save();

    return res.sendStatus(204);
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

    return res.sendStatus(204);
  }
}

export { HeroController };
