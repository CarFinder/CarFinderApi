import { BodyType, IBodyTypeModel, IMarkModel, IModelModel, Mark, Model } from '../db/';

export const getMarks = async (): Promise<IMarkModel[]> => {
  return (await Mark.find()) as IMarkModel[];
};

export const getBodyTypes = async (): Promise<IBodyTypeModel[]> => {
  return (await BodyType.find()) as IBodyTypeModel[];
};

export const getModelsByMark = async (markId: string): Promise<IModelModel[]> => {
  return (await Model.find({ markId })) as IModelModel[];
};

export const getMark = async (id: string): Promise<IMarkModel> => {
  return (await Mark.findById(id)) as IMarkModel;
};

export const getBodyType = async (id: string): Promise<IBodyTypeModel> => {
  return (await BodyType.findOne({ _id: id })) as IBodyTypeModel;
};

export const getModel = async (id: string): Promise<IModelModel> => {
  return (await Model.findById(id)) as IModelModel;
};
