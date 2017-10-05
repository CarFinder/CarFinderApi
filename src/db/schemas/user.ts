import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { IUser } from '../../interfaces/index';

export interface IUserModel extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string): boolean;
}

const UserSchema = new mongoose.Schema({
  confirmed: {
    type: Boolean,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
  interfaceLang: {
    default: 'ru',
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  subscription: {
    default: true,
    required: true,
    type: Boolean,
  },
});

UserSchema.methods.comparePassword = (candidatePassword: string): boolean => {
  return true;
}

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
