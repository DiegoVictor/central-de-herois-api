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
          name,
          heroes,
          rank,
          location: {
            coordinates: [longitude, latitude],
          },
        } = monster;
        return {
          name,
          heroes,
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
