import * as async from 'async';
import * as moment from 'moment';
import { IAdModel } from '../db/';
import { IAd } from '../interfaces/';
import { getAdByURL, getAll, markSeltAds, save, update } from '../repositories/adRepository';
import { get, getByFilter, getSoldCarsNumber } from '../repositories/adRepository';
import * as tempAdRepository from '../repositories/tempAdRepository';

export const getAllAds = async () => {
  return await getAll();
};

export const updateAds = async () => {
  await tempAdRepository.updateAds();
};

const saveAd = async (ad: IAd) => {
  await save(ad);
};

export const getAds = async (
  filter?: any,
  limit?: number,
  skip?: number,
  sort?: any
): Promise<IAdModel[]> => {
  const searchFilter: any = {};
  let sortParams = null;
  if (filter.markId) {
    searchFilter.markId = filter.markId;
  }
  if (filter.bodyTypeId && filter.bodyTypeId.length) {
    searchFilter.bodyTypeId = { $in: [...filter.bodyTypeId] };
  }
  if (filter.modelId && filter.modelId.length) {
    searchFilter.modelId = { $in: [...filter.modelId] };
  }
  if (filter.sourceName) {
    searchFilter.sourceName = filter.sourceName;
  }
  if (filter.priceFrom && !filter.priceTo) {
    searchFilter.price = {
      $gte: filter.priceFrom
    };
  }
  if (!filter.priceFrom && filter.priceTo) {
    searchFilter.price = {
      $lte: filter.priceTo
    };
  }
  if (filter.priceFrom && filter.priceTo) {
    searchFilter.price = {
      $gte: filter.priceFrom,
      $lte: filter.priceTo
    };
  }
  if (filter.kmsFrom && !filter.kmsTo) {
    searchFilter.kms = {
      $gte: filter.kmsFrom
    };
  }
  if (!filter.kmsFrom && filter.kmsTo) {
    searchFilter.kms = {
      $lte: filter.kmsTo
    };
  }
  if (filter.kmsFrom && filter.kmsTo) {
    searchFilter.kms = {
      $gte: filter.kmsFrom,
      $lte: filter.kmsTo
    };
  }
  if (filter.yearFrom && !filter.yearTo) {
    searchFilter.year = {
      $gte: filter.yearFrom
    };
  }
  if (!filter.yearFrom && filter.yearTo) {
    searchFilter.year = {
      $lte: filter.yearTo
    };
  }
  if (filter.yearFrom && filter.yearTo) {
    searchFilter.year = {
      $gte: filter.yearFrom,
      $lte: filter.yearTo
    };
  }
  if (sort) {
    sortParams = sort;
  }
  return await get(searchFilter, limit, skip, sortParams);
};

export const getLiquidity = async (filter: any) => {
  const time = moment()
    .subtract(1, 'month')
    .format();
  const adFilter: any = {};
  if (filter.markId) {
    adFilter.markId = filter.markId;
  }
  if (filter.modelId && filter.modelId.length) {
    adFilter.modelId = { $in: [...filter.modelId] };
  }
  adFilter.isSold = true;

  return await getSoldCarsNumber(adFilter, time);
};

export { markSeltAds };
