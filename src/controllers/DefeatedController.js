import { z } from 'zod';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const { heroes } = z
      .object({
        heroes: z.array(
          z.object({
            _id: z.string(0),
            status: z.enum(HERO_STATUS),
          })
        ),
      })
      .parse(req.body);

    const heroesId = heroes.map(({ _id }) => _id);
    const existingHeroes = await Hero.find({ _id: { $in: heroesId } });

    if (existingHeroes.length !== heroesId.length) {
      return res.status(400).json({
        error: {
          message: `Hero not found`,
        },
      });
    }

    await Promise.all(
      existingHeroes.map((hero) => {
        hero.status = heroes.find(
          ({ _id }) => _id === hero._id.toString()
        ).status;

        monster.heroes.push(hero._id);
        return hero.save();
      })
    );

    monster.status = 'defeated';
    await monster.save();

    return res.sendStatus(204);
  }
}

export { DefeatedController };
