import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { IUser } from '../../interfaces/';

export interface IUserModel extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string, callback: any): any;
}

const UserSchema = new mongoose.Schema({
  confirmed: {
    type: Boolean
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  image: {
    type: String
  },
  interfaceLang: {
    default: 'ru',
    type: String
  },
  name: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  subscription: {
    default: true,
    type: Boolean
  }
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: any) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      callback(err);
    }
    callback(null, isMatch);
  });
};

export { UserSchema };
