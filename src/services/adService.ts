import * as async from 'async';
import { IAdModel } from '../db/';
import { IAd } from '../interfaces/';
import { getAdByURL, getAll, markSeltAds, save, update } from '../repositories/adRepository';
import { get, getByFilter } from '../repositories/adRepository';
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

const updateFields = async (ad: IAd) => {
  const payload = {
    $set: {
      bodyTypeId: ad.bodyTypeId,
      description: ad.description,
      images: ad.images,
      isSelt: false,
      kms: ad.kms,
      markId: ad.modelId,
      modelId: ad.markId,
      price: ad.price,
      sourceName: ad.sourceName,
      sourceUrl: ad.sourceUrl,
      year: ad.year
    }
  };
  await update(ad.sourceUrl, payload);
};

export const getAdsByFilter = async (
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
  if (filter.bodyTypeId) {
    searchFilter.bodyTypeId = { $in: [...filter.bodyTypeId] };
  }
  if (filter.modelId) {
    searchFilter.modelId = { $in: [...filter.modelId] };
  }
  if (filter.sourceName) {
    searchFilter.sourceName = filter.sourceName;
  }
  if (filter.priceFrom && !filter.priceTo) {
    searchFilter.price = {
      $gt: filter.priceFrom
    };
  }
  if (!filter.priceFrom && filter.priceTo) {
    searchFilter.price = {
      $lt: filter.priceTo
    };
  }
  if (filter.priceFrom && filter.priceTo) {
    searchFilter.price = {
      $gt: filter.priceFrom,
      $lt: filter.priceTo
    };
  }
  if (filter.kmsFrom && !filter.kmsTo) {
    searchFilter.kms = {
      $gt: filter.kmsFrom
    };
  }
  if (!filter.kmsFrom && filter.kmsTo) {
    searchFilter.kms = {
      $lt: filter.kmsTo
    };
  }
  if (filter.kmsFrom && filter.kmsTo) {
    searchFilter.kms = {
      $gt: filter.kmsFrom,
      $lt: filter.kmsTo
    };
  }
  if (filter.yearFrom && !filter.yearTo) {
    searchFilter.year = {
      $gt: filter.yearFrom
    };
  }
  if (!filter.yearFrom && filter.yearTo) {
    searchFilter.year = {
      $lt: filter.yearTo
    };
  }
  if (filter.yearFrom && filter.yearTo) {
    searchFilter.year = {
      $gt: filter.yearFrom,
      $lt: filter.yearTo
    };
  }
  if (sort) {
    sortParams = { [sort.field]: sort.sort };
  }
  return await getByFilter(searchFilter, limit, skip, sortParams);
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

export { markSeltAds };
