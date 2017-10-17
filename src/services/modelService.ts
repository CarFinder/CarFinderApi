import { IModelModel } from '../db/';
import { getAll, update } from '../repositories/modelRepository';

export const getAllModels = async () => {
  return await getAll();
};

export const updateModels = async (models: any) => {
  const knownModels: IModelModel[] = await getAllModels();
  if (knownModels.length === 0) {
    await saveModels(models);
    return;
  } else {
    for (const model of models) {
      addNewModel(knownModels, model);
    }
    for (let index = 0; index < knownModels.length; index++) {
      knownModels[index] = await updateModelFields(knownModels[index], models);
    }
    await saveModels(knownModels);
    return;
  }
};

const saveModels = async (models: any) => {
  for (const model of models) {
    await update(model);
  }
};

const updateModelFields = (currentModel: any, models: any) => {
  let selectedModel;
  let modelIndex;
  for (const model of models) {
    if (currentModel.name === model.name) {
      selectedModel = model;
      modelIndex = models.indexOf(model);
    }
  }
  const response = Object.assign(currentModel, selectedModel);
  models.splice(modelIndex, 1);
  return response;
};

const addNewModel = (knownModels: any, model: any) => {
  let isExist = false;
  for (const knownModel of knownModels) {
    if (knownModel.name === model.name) {
      isExist = true;
    }
  }
  if (!isExist) {
    knownModels.push(model);
  }
};
