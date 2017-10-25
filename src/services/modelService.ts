import { IModelModel } from '../db/';
import { IModel } from '../interfaces/';
import { getAll, getByName, update } from '../repositories/modelRepository';

export const getAllModels = async () => {
  return await getAll();
};

export const updateModels = async (models: IModel[]) => {
  const knownModels: IModelModel[] = await getAllModels();
  const newModels: IModel[] = [];
  if (knownModels.length === 0) {
    await saveModels(models);
    return;
  } else {
    for (const model of models) {
      addNewModel(knownModels, model, newModels);
    }
    await saveModels(newModels);
    return;
  }
};

const saveModels = async (models: IModel[]) => {
  for (const model of models) {
    await update(model);
  }
};

const addNewModel = (knownModels: IModel[], model: IModel, newModels: IModel[]) => {
  const isExist = knownModels.find(knownModel => knownModel.name === model.name);
  if (!isExist) {
    newModels.push(model);
  }
};

export const getModelByName = async (name: string) => {
  return await getByName(name);
};

export const saveNewModel = async (name: string, markId: string) => {
  await update({ markId, name });
};
