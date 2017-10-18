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
