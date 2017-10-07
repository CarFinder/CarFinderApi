import { get } from '../repositories/userRepository';

import { IUser } from '../interfaces/';

export const comparePassword = (email: string, password: string, done: any) => {
  get(email)
    .then(user => {
      if (user) {
        user.comparePassword(password, (error: any, isMatch: boolean) => {
          if (error) {
            return done(error);
          }
          if (!isMatch) {
            return done(null, false, 'Incorrect password');
          }

          return done(null, {
            confirmed: user.confirmed,
            email: user.email,
            id: user._id,
            image: user.image,
            interfaceLang: user.interfaceLang,
            name: user.name,
            subscription: user.subscription
          });
        });
      } else {
        return done(null, false, 'Incorrect email');
      }
    })
    .catch(err => {
      done(err);
    });
};
