import { get } from '../repositories/userRepository';

import { IUser } from '../interfaces/index';

export const comparePassword = (email: string, password: string, done: any) => {
  get(email)
    .then((user) => {
      user.comparePassword(password, (error: any, isMatch: boolean) => {
        if (error) { return done(error); }
        if (!isMatch) { return done(null, false); }
        return done(null, {
          confirmed: user.confirmed,
          email: user.email,
          id: user._id,
          image: user.image,
          interfaceLang: user.interfaceLang,
          name: user.name,
          subscription: user.subscription,
        });
      });
    })
    .catch((err) => {
      done(err)
    });
}
