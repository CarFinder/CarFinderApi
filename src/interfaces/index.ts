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
}

export interface IFilter {
  bodyTypeId?: string;
  markId: string;
  kmsTo?: number;
  priceTo?: number;
  yearTo?: number;
  kmsFrom?: number;
  priceFrom?: number;
  yearFrom?: number;
  modelId?: string;
  name?: string;
  userId?: string;
  sourceName?: string;
}

export interface IBodyType {
  name: string;
}

export interface IAd {
  bodyTypeId: string;
  description?: string;
  images?: string[];
  markId: string;
  kms?: number;
  modelId: string;
  price?: number;
  sourceName: string;
  sourceUrl: string;
  year: number;
}
