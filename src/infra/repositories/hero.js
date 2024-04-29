import { model, Schema } from 'mongoose';

import { HERO_RANK, HERO_STATUS, HERO_STATUS_NAMED } from '../../entities/hero';

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
      enum: HERO_RANK,
      required: true,
    },
    status: {
      type: String,
      enum: HERO_STATUS,
      required: true,
    },
  },
  { timestamps: true, collection: 'heroes' }
);

export const Hero = model('Hero', schema);

export class HeroRepository {
  async findMany(ids) {
    if (ids && Array.isArray(ids)) {
      return Hero.find({ _id: { $in: ids } });
    }
    return Hero.find();
  }

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

  async findReadyForCombatNearby({ longitude, latitude, meters }) {
    return Hero.find({
      status: {
        $nin: [HERO_STATUS_NAMED.FIGHTING, HERO_STATUS_NAMED.OUT_OF_COMBAT],
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: meters,
        },
      },
    });
  }

  async setManyAsFightingById(ids) {
    return Hero.updateMany(
      {
        _id: { $in: ids },
      },
      {
        $set: {
          status: HERO_STATUS_NAMED.FIGHTING,
        },
      }
    );
  }

  async deleteOneById(id) {
    return Hero.deleteOne({ _id: id });
  }
}
