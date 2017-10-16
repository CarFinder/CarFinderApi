export interface Imark {
  id: number;
  model: string;
}

export interface Imodel {
  id: number;
  model: string;
}

export interface IParse {
  models: Imodel[];
  marks: Imark[];
  ads: any[];
}
