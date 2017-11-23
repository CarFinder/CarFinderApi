import { Imark, Imodel, IParser } from '../interfaces/parserInterface';
import * as av from './avParser/';
import * as onliner from './onlinerParser/';

export class Api implements IParser {
  public models: any;
  public marks: Imark[];
  public ads: any;
  public bodyTypes: string[];

  // * this fields should be changed is we use another source for ads
  public scrapeAndGetMarks: any;
  public scrapeAndGetBodyTypes: any;
  public scrapeAndGetModels: any;
  public scrapeAndGetAds: any;

  constructor(codeOfSource: number) {
    switch (codeOfSource) {
      case 1:
        this.scrapeAndGetMarks = onliner.getMarks;
        this.scrapeAndGetModels = onliner.getModels;
        this.scrapeAndGetAds = onliner.getAdsForCurrentModel;
        this.scrapeAndGetBodyTypes = onliner.getBodyTypes;
        break;
      case 2:
        this.scrapeAndGetMarks = av.getMarks;
        this.scrapeAndGetModels = av.getModels;
        this.scrapeAndGetBodyTypes = av.getBodyTypes;
        this.scrapeAndGetAds = av.getAdsForCurrentModel;
    }
  }

  public setModels(models: Imodel[]) {
    this.models = models;
  }

  public getModels() {
    return this.models;
  }

  public setMarks(marks: Imark[]) {
    this.marks = marks;
  }

  public getMarks() {
    return this.marks;
  }

  public setAds(ads: any) {
    this.ads = ads;
  }

  public getAds() {
    return this.ads;
  }

  public setBodyTypes(bodyTypes: string[]) {
    this.bodyTypes = bodyTypes;
  }

  public getBodyTypes() {
    return this.bodyTypes;
  }

  public async updateMarks() {
    const marks: any = await this.scrapeAndGetMarks();
    await this.setMarks(marks.slice(40));
  }

  public async updateModels() {
    const models: any = await this.scrapeAndGetModels(this.marks);
    await this.setModels(models);
  }

  public async updateAds(mark: any) {
    const ads: any = await this.scrapeAndGetAds(mark);
    await this.setAds(ads);
  }

  public async updateBodyTypes() {
    const types = await this.scrapeAndGetBodyTypes();
    await this.setBodyTypes(types);
  }
}
