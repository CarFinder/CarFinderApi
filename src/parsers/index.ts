import { Imark, Imodel, IParse } from '../interfaces/parserInterface';
import { getMarks, getModels } from './onlinerParser/';

export class Api implements IParse {
  public models: Imodel[];
  public marks: Imark[];
  public ads: any[];
  public scrumAndGetMarks: any;
  public scrumAndGetModels: any;

  constructor(codeOfSource: number) {
    switch (codeOfSource) {
      case 1:
        this.scrumAndGetMarks = getMarks;
        this.scrumAndGetModels = getModels;
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

  public async updateMarks() {
    const marks: any = await this.scrumAndGetMarks();
    await this.setMarks(marks);
  }

  public async updateModels(markID: number) {
    const models: any = await this.scrumAndGetModels(markID);
    await this.setModels(models);
  }
}
