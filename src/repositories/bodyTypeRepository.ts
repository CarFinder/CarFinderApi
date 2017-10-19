import { BodyType, IBodyTypeModel } from '../db';

export const save = async (bodyType: any) => {
  const newBodyType = new BodyType(bodyType);
  newBodyType.save(err => err);
};

export const getAll = async () => {
  return await BodyType.find();
};

export const getByName = async (name: string) => {
  return await BodyType.findOne({ name });
};
