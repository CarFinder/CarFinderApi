import * as _ from 'lodash';
import { sourceCodes } from '../config/config';
import { IOnlinerMark, ITransformedAd, ITransformedMarks } from '../interfaces/parserInterface';
import { Api } from '../parsers/';
import { updateDBData } from '../services/';
import { getBodyTypeByName } from '../services/bodyTypeService';
import { getMarkByName } from '../services/markService';
import { updateMarks } from '../services/markService';
import { getModelByName, saveNewModel } from '../services/modelService';

export const transformOnlinerDate = (onlinerDate: string) => {
  let date = onlinerDate.substring(0, 10);
  const arrayofDate: any = date.split('-');
  arrayofDate[1] = parseInt(arrayofDate[1], 10);
  arrayofDate[1] += 1;
  if (arrayofDate[1] > 12) {
    arrayofDate[1] = arrayofDate[1] - 12;
  }
  date = arrayofDate.join('-');
  return new Date(date);
};

export const transformOnlinerModelsData = (models: any, markId: string) => {
  const transformedModels: any = [];
  if (!models) {
    return [];
  }
  models.forEach((model: any) => {
    const key = Object.keys(model);
    const modelName = key[0];
    transformedModels.push({
      markId,
      name: modelName
    });
  });
  return transformedModels;
};

export const getOnlinerAds = async (markId: number) => {
  const api = new Api(1);
  await api.updateAds(markId);
  return await api.getAds();
};

const transformOnlinerMarks = (marks: IOnlinerMark[]) => {
  const transformedMarks: any = [];
  marks.forEach((mark: any) => {
    transformedMarks.push({
      name: mark.name,
      onlinerMarkId: mark.id
    });
  });
  return transformedMarks;
};

export const transformAdsData = async (markId: string, ads: object, bodyTypes: string[]) => {
  const transformedAds: any = [];
  _.forEach(ads, (val: any, key: any) => {
    transformedAds.push({
      bodyTypeId: val.car.body,
      creationDate: transformOnlinerDate(val.creationDate.date),
      description: val.description,
      images: val.photos,
      kms: val.car.odometerState,
      lastTimeUpDate: transformOnlinerDate(val.lastTimeUp.date),
      markId,
      modelName: val.car.model.name,
      price: val.price,
      sourceName: 'onliner',
      sourceUrl: 'https://ab.onliner.by/car/' + val.id,
      year: val.car.year
    });
  });

  // used for of loop, cause async-await is present
  for (const ad of transformedAds) {
    // positions in array starts with 0 but bodyType id's start with 1
    const bodyName = bodyTypes[ad.bodyTypeId - 1];
    const bodyType = await getBodyTypeByName(bodyName);
    let modelId;
    try {
      const model = await getModelByName(ad.modelName);
      modelId = model.id;
    } catch (e) {
      await saveNewModel(ad.modelName, markId);
      const model = await getModelByName(ad.modelName);
      modelId = model.id;
    }
    const images: string[] = [];
    ad.images.forEach((item: ITransformedAd) => {
      images.push(item.images.original);
    });
    ad.images = images;
    ad.modelId = modelId;
    ad.bodyTypeId = bodyType.id;
    delete ad.modelName;
  }
  return transformedAds;
};

// update ads, models, marks, body types, fill db is it is empty

export const updateServiceData = async () => {
  const api = new Api(sourceCodes.ONLINER);
  await api.updateMarks();
  const marks = api.getMarks();
  await api.updateModels();
  const models = api.getModels();
  const transfomedMarks = transformOnlinerMarks(marks);
  await api.updateBodyTypes();
  const bodyTypes = api.getBodyTypes();
  await updateDBData(transfomedMarks, models, bodyTypes);
};
