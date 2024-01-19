import { z } from 'zod';
import { HERO_RANK, HERO_STATUS } from '../../entities/hero';

const defeated = (data) =>
  z
    .object({
      heroes: z.array(
        z.object({
          _id: z.string(0),
          status: z.enum(HERO_STATUS),
        })
      ),
    })
    .parse(data);

const store = (data) =>
  z
    .object({
      name: z.string(),
      latitude: z.string().or(z.number()),
      longitude: z.string().or(z.number()),
      rank: z.enum(HERO_RANK),
      status: z.enum(HERO_STATUS),
      description: z.string(),
    })
    .parse(data);

const update = (data) =>
  z
    .object({
      name: z.string().optional(),
      latitude: z.string().or(z.number()).optional(),
      longitude: z.string().or(z.number()).optional(),
      rank: z.enum(HERO_RANK).optional(),
      status: z.enum(HERO_STATUS).optional(),
      description: z.string().optional(),
    })
    .parse(data);

export const heroValidators = { defeated, store, update };
