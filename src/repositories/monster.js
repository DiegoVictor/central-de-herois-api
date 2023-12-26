import { model, Schema } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: new Schema({
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      }),
      index: '2dsphere',
    },
    heroes: [Schema.Types.ObjectId],
    status: {
      type: String,
      enum: ['fighting', 'defeated', 'free'],
      required: true,
    },
    rank: {
      type: String,
      enum: ['God', 'Dragon', 'Tiger', 'Wolf'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Monster = model('Monster', schema);

export class MonsterRepository {
  async aggregateByStatus(status) {
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

    return Monster.aggregate(aggregation);
  }

  async findById(id) {
    return Monster.findById(id);
  }

  async create({ name, rank, heroes, longitude, latitude }) {
    return Monster.create({
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      rank,
      heroes,
      status: 'fighting',
    });
  }
}
