import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { IUser } from '../../interfaces/index';
import { sendMail } from '../../utils';

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
    required: true,
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
    required: true,
    type: Boolean
  }
});

UserSchema.methods.comparePassword = (candidatePassword: string, callback: any) => {
  callback(null, true);
};

UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (error: any, hash: any) => {
      if (error) {
        return next(error);
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      user.password = hash;
      next();
    });
  });
});

UserSchema.post('save', function() {
  const user = this;
  sendMail(this.email, this.name);
});

export { UserSchema };
