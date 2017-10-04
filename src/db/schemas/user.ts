import * as mongoose from 'mongoose';

const UserSchema = {
  confirmed: {
    type: Boolean,
  },
  email: {
    required: true,
    type: String,
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
};

const User = mongoose.model('User', new mongoose.Schema(UserSchema));

export default User;
