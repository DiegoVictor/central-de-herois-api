import { z } from 'zod';

const store = (data) =>
  z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .parse(data);

export const sessionValidators = { store };
