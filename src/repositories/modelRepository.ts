import { IModelModel, Model } from '../db';
import { IModel } from '../interfaces';

export const getAll = async () => {
  return await Model.find();
};

export const update = async (model: IModel) => {
  const newModel = new Model(model);
  await newModel.save(err => {
    return err;
  });
};

export const getByName = async (name: string) => {
  return await Model.findOne({ name });
};
