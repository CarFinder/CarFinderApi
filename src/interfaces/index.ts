export interface IUser {
  id?: string;
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
  kmsTo?: number;
  priceTo?: number;
  yearTo?: number;
  kmsFrom?: number;
  priceFrom?: number;
  yearFrom?: number;
  modelId?: string;
  name?: string;
  url?: string;
  userId?: string;
  sourceName?: string;
}

export interface IBodyType {
  name: string;
  id?: string;
}

export interface IAd {
  bodyTypeId: string;
  creationDate: Date;
  description?: string;
  images?: string[];
  isSold: boolean;
  markId: string;
  kms?: number;
  lastTimeUpDate: Date;
  modelId: string;
  price?: number;
  sourceName: string;
  sourceUrl: string;
  year: number;
}

export interface IAdForClient {
  _id: string;
  bodyType: string;
  description: string;
  images: string[];
  kms: number;
  mark: string;
  model: string;
  price: number;
  sourceName: string;
  sourceUrl: string;
  year: number;
}

export interface ISavedFilterAds {
  filterName: string;
  filterId: string;
  filterUrl: string;
  ads: IAdForClient[];
}

export interface IUserImage {
  image: string;
  type: string;
}
