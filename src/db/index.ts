import * as mongoose from 'mongoose';
import { IUserModel, UserSchema } from './schemas/user';

export { IUserModel };
export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);
