import { Imark, Imodel, IParser } from '../interfaces/parserInterface';
import * as onliner from './onlinerParser/';

export class Api implements IParser {
  public models: any;
  public marks: Imark[];
  public ads: any;
  public bodyTypes: string[];

  // * this fields should be changed is we use another source for ads
  public scrumAndGetMarks: any;
  public scrumAndGetBodyTypes: any;
  public scrumAndGetModels: any;
  public scrumAndGetAds: any;

  constructor(codeOfSource: number) {
    switch (codeOfSource) {
      case 1:
        this.scrumAndGetMarks = onliner.getMarks;
        this.scrumAndGetModels = onliner.getModels;
        this.scrumAndGetAds = onliner.getAdsForCurrentModel;
        this.scrumAndGetBodyTypes = onliner.getBodyTypes;
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
    const marks: any = await this.scrumAndGetMarks();
    await this.setMarks(marks);
  }

  public async updateModels() {
    const models: any = await this.scrumAndGetModels();
    await this.setModels(models);
  }

  public async updateAds(markId: number) {
    const ads: any = await this.scrumAndGetAds(markId);
    await this.setAds(ads);
  }

  public async updateBodyTypes() {
    const types = await this.scrumAndGetBodyTypes();
    await this.setBodyTypes(types);
  }
}
