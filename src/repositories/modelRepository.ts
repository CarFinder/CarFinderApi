import { IModelModel, Model } from '../db';
import { IModel } from '../interfaces';
import { handleDatabaseError } from '../utils';

export const getAll = async () => {
  return await Model.find();
};

export const update = async (models: IModel[]) => {
  await Model.create(models);
};

export const getByName = async (name: string) => {
  return await Model.findOne({ name });
};


export const getById = async (id: string) => {
  return await Model.findOne({_id: id});
};

export const getByNameAndMarkId = async (name: string, markId: string) => {
  return await Model.findOne({ markId, name });
};

export const getModelsByMarkIdAndNames = async (names: string[], markId: string) => {
  return await Model.find({ name: { $in: names }, markId });
};
