import { codeErrors } from '../config/config';
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
            return done(null, false);
          }

          return done(null, {
            email: user.email,
            image: user.image,
            interfaceLang: user.interfaceLang,
            name: user.name,
            subscription: user.subscription
          });
        });
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      done(err);
    });
};

export const getUser = (email: string, done: any) => {
  get(email)
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done('Error');
      }
    })
    .catch(err => {
      done(err);
    });
};
