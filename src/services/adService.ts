import { IAdModel } from '../db/';
import { IFilter } from '../interfaces';
import { getByFilter } from '../repositories/adRepository';

export const getAdsByFilter = async (
  filter?: IFilter,
  limit?: number,
  skip?: number,
  sort?: string
): Promise<IAdModel[]> => {
  const searchFilter: any = {};
  if (filter.bodyTypeId) {
    searchFilter.bodyTypeId = filter.bodyTypeId;
  }
  if (filter.modelId) {
    searchFilter.modelId = filter.modelId;
  }
  if (filter.sourceName) {
    searchFilter.sourceName = filter.sourceName;
  }
  if (filter.minPrice && !filter.maxPrice) {
    searchFilter.price = {
      $gt: filter.minPrice
    };
  }
  if (!filter.minPrice && filter.maxPrice) {
    searchFilter.price = {
      $lt: filter.maxPrice
    };
  }
  if (filter.minPrice && filter.maxPrice) {
    searchFilter.price = {
      $gt: filter.minPrice,
      $lt: filter.maxPrice
    };
  }
  if (filter.minMileFrom && !filter.maxMileFrom) {
    searchFilter.mileFrom = {
      $gt: filter.minMileFrom
    };
  }
  if (!filter.minMileFrom && filter.maxMileFrom) {
    searchFilter.mileFrom = {
      $lt: filter.maxMileFrom
    };
  }
  if (filter.minMileFrom && filter.maxMileFrom) {
    searchFilter.mileFrom = {
      $gt: filter.minMileFrom,
      $lt: filter.maxMileFrom
    };
  }
  if (filter.minYear && !filter.maxYear) {
    searchFilter.year = {
      $gt: filter.minYear
    };
  }
  if (!filter.minYear && filter.maxYear) {
    searchFilter.year = {
      $lt: filter.maxYear
    };
  }
  if (filter.minYear && filter.maxYear) {
    searchFilter.year = {
      $gt: filter.minYear,
      $lt: filter.maxYear
    };
  }
  return await getByFilter(searchFilter, limit, skip, sort);
};
