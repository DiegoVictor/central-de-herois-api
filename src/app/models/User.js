import { model, Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function beforeSave(next) {
  if (this.isNew) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
  next();
});

export const User = model('User', UserSchema);
