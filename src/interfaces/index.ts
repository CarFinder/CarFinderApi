export interface IUser {
  confirmed?: boolean;
  email?: string;
  image?: string;
  interfaceLang?: string;
  name?: string;
  password?: string;
  subscription?: string;
}

export interface IErrorData {
  type: string;
  code: number;
}

export interface IModel {
  markId: string;
  name: string;
}

export interface IMark {
  name: string;
  onlinerMarkId?: number;
}

export interface IFilter {
  bodyTypeId?: string;
  markId: string;
  maxMileFrom?: number;
  maxPrice?: number;
  maxYear?: number;
  minMileFrom?: number;
  minPrice?: number;
  minYear?: number;
  modelId?: string;
  name: string;
  userId: string;
}

export interface IBodyType {
  name: string;
}

export interface IAd {
  bodyTypeId: string;
  description?: string;
  images?: string[];
  markId: string;
  milesFrom?: number;
  modelId: string;
  price?: number;
  sourceName: string;
  sourceUrl: string;
  year: number;
}
