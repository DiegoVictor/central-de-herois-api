import mongoose from 'mongoose';

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export const setupDatabase = async (cb = null) => {
  mongoose.connect(process.env.MONGO_URL, config).then(cb);
};
