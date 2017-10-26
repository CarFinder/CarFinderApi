import { IModelModel, Model } from '../db';
import { IModel } from '../interfaces';
import { handleDatabaseError } from '../utils';

export const getAll = async () => {
  return await Model.find();
};

export const update = async (model: IModel) => {
  const newModel = new Model(model);
  const error = await newModel.save(err => {
    if (err) {
      handleDatabaseError(err);
    }
  });
};

export const getByName = async (name: string) => {
  return await Model.findOne({ name });
};
