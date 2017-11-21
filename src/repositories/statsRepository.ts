import { Ad, Model, User } from '../db/';
import { IStats } from '../interfaces';

export const getStats = async () => {
  const data: IStats = {
    ads: await Ad.count({}),
    models: await Model.count({}),
    users: await User.count({})
  };

  return data;
};
