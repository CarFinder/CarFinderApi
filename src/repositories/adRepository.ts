import { Ad, IAdModel } from '../db/';

export const save = async (ad: object) => {
  const newAd = new Ad(ad);
  newAd.save(err => err);
};

export const getAll = async () => {
  return await Ad.find();
};
