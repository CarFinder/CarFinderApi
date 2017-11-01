import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { emailActions } from '../../config/config';
import { IUser } from '../../interfaces/index';
import { sendMail } from '../../utils';

export interface IUserModel extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string, callback: any): any;
}

const UserSchema = new mongoose.Schema(
  {
    confirmed: {
      default: false,
      type: Boolean
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    expireAt: {
      default: new Date(),
      required: true,
      type: Date
    },
    image: {
      default: '',
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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

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

UserSchema.post('save', async function() {
  const user = this;
  try {
    await sendMail(this.email, this.name, emailActions.CONFIRM_REGISTRATION);
  } catch (err) {
    global.console.log('Mail quota exceeded.');
  }
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: any) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatching) => {
    if (err) {
      callback(err);
    } else {
      callback(null, isMatching);
    }
  });
};

export { UserSchema };
