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
  enMessage: string;
  ruMessage: string;
}
