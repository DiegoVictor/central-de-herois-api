import { success } from '../contracts/success';

export class GetMonstersUseCase {
  constructor(monsterRepository) {
    this.monsterRepository = monsterRepository;
  }

  async execute({ status }) {
    const monsters = await this.monsterRepository.aggregateByStatus(status);

    return success(
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
