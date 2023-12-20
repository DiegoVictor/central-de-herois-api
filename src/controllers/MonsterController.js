import { Monster } from '../models/Monster';

class MonsterController {
  async index(req, res) {
    const { status } = req.query;
    const aggregation = [
      {
        $lookup: {
          from: 'heroes',
          localField: 'heroes',
          foreignField: '_id',
          as: 'heroes',
        },
      },
    ];

    if (status) {
      aggregation.push({
        $match: { status },
      });
    }

    const monsters = await Monster.aggregate(aggregation);
    return res.json(
      monsters.map((monster) => {
        const {
          _id,
          name,
          heroes,
          rank,
          location: {
            coordinates: [longitude, latitude],
          },
        } = monster;
        return {
          _id,
          name,
          heroes: heroes.map((hero) => ({
            _id: hero._id,
            name: hero.name,
            status: hero.status,
            rank: hero.rank,
            description: hero.description,
            longitude: hero.location.coordinates[0],
            latitude: hero.location.coordinates[1],
          })),
          status: monster.status,
          rank,
          longitude,
          latitude,
        };
      })
    );
  }
}

export { MonsterController };
