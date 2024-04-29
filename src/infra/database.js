import mongoose from 'mongoose';

export const setupDatabase = async (cb = null) => {
  mongoose.connect(process.env.MONGO_URL).then(cb);
};
