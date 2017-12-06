import { BodyType, IBodyTypeModel } from '../db';
import { IBodyType } from '../interfaces/';
import { handleDatabaseError } from '../utils';

export const save = async (bodyType: IBodyType) => {
  const newBodyType = new BodyType(bodyType);
  await newBodyType.save(err => {
    if (err) {
      handleDatabaseError(err);
    }
  });
};

export const getAll = async () => {
  return await BodyType.find();
};

export const getByName = async (name: string) => {
  return await BodyType.findOne({ name: new RegExp(name, 'i') });
};

export const getById = async (id: string) => {
  return await BodyType.findOne({ _id: id });
};
