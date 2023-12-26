import { Monster } from '../repositories/monster';
import { Hero } from '../models/Hero';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const monster = await Monster.findById(id);

    if (!monster) {
      return res.status(404).json({
        error: {
          message: 'Monster not found',
        },
      });
    }

    const { heroes } = req.body;

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
