<<<<<<< HEAD
=======
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

>>>>>>> e3f1e7abeb14d5d3e51f5c4408f1e362fa5069d5
import * as moment from 'moment';
import { sourceCodes } from '../config/config';
import { IOnlinerMark, ITransformedAd, ITransformedMarks } from '../interfaces/parserInterface';
import { Api } from '../parsers/';
import { updateDBData, updateDBDataFromOnliner, updateDBDateFromAvBy } from '../services/';
import { getBodyTypeByName } from '../services/bodyTypeService';
import { getMarkByName } from '../services/markService';
import { updateMarks } from '../services/markService';
import { getModelByName, getModelByNameAndMarkId, saveNewModel } from '../services/modelService';

<<<<<<< HEAD
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

export const transformOnlinerDate = (onlinerDate: string): Date => {
=======
export const transformOnlinerDate = (onlinerDate: string): string => {
>>>>>>> e3f1e7abeb14d5d3e51f5c4408f1e362fa5069d5
  let date = onlinerDate.substring(0, 10);
  const arrayofDate: any = date.split('-');
  arrayofDate[1] = parseInt(arrayofDate[1], 10);
  if (arrayofDate[1] > 12) {
    arrayofDate[1] = arrayofDate[1] - 12;
  }
  date = arrayofDate.join('-');
  return moment(date, 'DD-MM-YYYY').toDate();
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

export const updateOnlinerData = async () => {
  const api = new Api(sourceCodes.ONLINER);
  await api.updateMarks();
  const marks = api.getMarks();
  await api.updateModels();
  const models = api.getModels();
  const transfomedMarks = transformOnlinerMarks(marks);
  await api.updateBodyTypes();
  const bodyTypes = api.getBodyTypes();
  await updateDBDataFromOnliner(transfomedMarks, models, bodyTypes);
};

export const transformAvByBodyTypes = (bodyTypes: any[]) => {
  return _.chain(bodyTypes)
    .map((type: any) => {
      const name = _.capitalize(type);
      return name === 'Легковой фургон' // we take only first word of the bodytype name, exclude "Легковой фургон"
        ? name
        : _.chain(name)
            .split(' ')
            .shift()
            .value();
    })
    .uniq()
    .value();
};

export const transformAvByMarks = (marks: any[]) => {
  return _.map(marks, (mark: any) => ({ name: mark.name }));
};

export const getAvByAds = async (model: any) => {
  const api = new Api(sourceCodes.AV);
  await api.updateAds(model);
  return api.getAds();
};

export const transformAvByAds = async (ads: any[], markId: string) => {
  let transformedAds: any[] = [];
  for (const ad of ads) {
    const model: any = await getModelByNameAndMarkId(ad.model, markId);
    const bodyType: any = await getBodyTypeByName(ad.bodyType);
    const transformedAd = {
      bodyTypeId: bodyType.id,
      creationDate: ad.creationDate,
      description: ad.description,
      images: ad.images,
      kms: ad.kms,
      lastTimeUpDate: ad.lastTimeUpDate,
      markId,
      modelId: model.id,
      price: ad.price,
      sourceName: ad.sourceName,
      sourceUrl: ad.sourceUrl,
      year: ad.year
    };
    transformedAds = [...transformedAds, transformedAd];
  }
  return transformedAds;
};

export const updateAvByData = async () => {
  const api = new Api(sourceCodes.AV);
  await api.updateBodyTypes();
  const trandformedBodyTypes = transformAvByBodyTypes(api.getBodyTypes());
  await api.updateMarks();
  const marks = transformAvByMarks(api.getMarks());
  await api.updateModels();
  const models = api.getModels();
  await updateDBDateFromAvBy(marks, models, trandformedBodyTypes);
};

export const transformBmvAvModel = (name: string): string => {
  let transformedName;
  transformedName = name.indexOf('-') === -1 ? name.split(' ').shift() : name;
  transformedName = transformedName.indexOf('-') !== -1 ? `Серия ${name[0]}` : transformedName;
  return transformedName;
};

export const transformMercedesAvModel = (name: string): string => {
  if (name.length <= 3) {
    return `${name}-класс`;
  }
  if (name.indexOf('-') !== -1) {
    return `${name.split('-').shift()}-класс`;
  }
  return name;
};
