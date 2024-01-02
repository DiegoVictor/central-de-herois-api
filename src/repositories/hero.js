import { model, Schema } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    rank: {
      type: String,
      enum: ['S', 'A', 'B', 'C'],
      required: true,
    },
    status: {
      type: String,
      enum: ['fighting', 'out_of_combat', 'patrolling', 'resting'],
      required: true,
    },
  },
  { timestamps: true, collection: 'heroes' }
);

export const Hero = model('Hero', schema);

export class HeroRepository {

  async findOneById(id) {
    return Hero.findById(id);
  }

  async findOneByName(name) {
    return Hero.findOne({ name });
  }

  async findOneByNameAndUpdate({
    name,
    longitude,
    latitude,
    rank,
    status,
    description,
  }) {
    return Hero.findOneAndUpdate(
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
  }
}
