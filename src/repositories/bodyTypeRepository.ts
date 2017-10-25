import { BodyType, IBodyTypeModel } from '../db';
import { IBodyType } from '../interfaces/';

export const save = async (bodyType: IBodyType) => {
  const newBodyType = new BodyType(bodyType);
  await newBodyType.save(err => err);
};

export const getAll = async () => {
  return await BodyType.find();
};

export const getByName = async (name: string) => {
  return await BodyType.findOne({ name });
};
