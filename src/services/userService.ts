import { get } from '../repositories/userRepository';

export const comparePassword = (email: string, password: string, done: any) => {
  get(email)
    .then((user) => {
      user.comparePassword(password, (error: any, isMatch: boolean) => {
        if (error) { return done(error); }
        if (!isMatch) { return done(null, false); }
        return done(null, { user });
      });
    })
    .catch((err) => {
      done(err)
    });
}
