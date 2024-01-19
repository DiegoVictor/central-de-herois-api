import { z } from 'zod';

const store = (data) =>
  z
    .object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })
    .parse(data);

export const userValidators = { store };
