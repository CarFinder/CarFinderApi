import { IAdModel } from '../db/';
import { getByFilter } from '../repositories/adRepository';

export const getAdsByFilter = async (
  filter?: any,
  limit?: number,
  skip?: number,
  sort?: string
): Promise<IAdModel[]> => {
  const searchFilter: any = {};
  if (filter.bodyTypeId) {
    searchFilter.bodyTypeId = { $in: [...filter.bodyTypeIds] };
  }
  if (filter.modelId) {
    searchFilter.modelId = { $in: [...filter.modelIds] };
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
  return await getByFilter(searchFilter, limit, skip, sort);
};
