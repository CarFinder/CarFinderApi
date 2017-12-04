import { IModelModel } from '../db/';
import { IModel } from '../interfaces/';
import { getAll, getByName, getByNameAndMarkId, update } from '../repositories/modelRepository';

export const getAllModels = async () => {
  return await getAll();
};

export const updateModels = async (models: IModel[], markId: string) => {
  const knownModels: IModelModel[] = await getAllModels();
  const newModels: IModel[] = [];
  if (knownModels.length === 0) {
    await saveModels(models);
    return;
  } else {
    for (const model of models) {
      addNewModel(knownModels, model, newModels, markId);
    }
    await saveModels(newModels);
    return;
  }
};

const saveModels = async (models: IModel[]) => {
  await update(models);
};

const addNewModel = (knownModels: IModel[], model: IModel, newModels: IModel[], markId: string) => {
  const isExist = knownModels.find(
    knownModel => knownModel.name === model.name && markId === knownModel.markId
  );
  if (!isExist) {
    newModels.push(model);
  }
};

export const getModelByName = async (name: string) => {
  return await getByName(name);
};

export const getModelByNameAndMarkId = async (name: string, markId: string) => {
  return await getByNameAndMarkId(name, markId);
};

export const saveNewModel = async (name: string, markId: string) => {
  await update([{ markId, name }]);
};
