import { IModelModel } from '../db/';
import { getAll, getByName, update } from '../repositories/modelRepository';

export const getAllModels = async () => {
  return await getAll();
};

export const updateModels = async (models: any) => {
  const knownModels: IModelModel[] = await getAllModels();
  const newModels: any = [];
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

const saveModels = async (models: any) => {
  for (const model of models) {
    await update(model);
  }
};

const addNewModel = (knownModels: any, model: any, newModels: any) => {
  let isExist = false;
  for (const knownModel of knownModels) {
    if (knownModel.name === model.name) {
      isExist = true;
    }
  }
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
