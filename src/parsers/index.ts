import { Imark, Imodel, IParse } from "../interfaces/parserInterface";
import { getModels } from "./onlinerParser/";

export class Api implements IParse {
  public models: Imodel[];
  public marks: Imark[];
  public ads: any[];
  public scrumAndGetMarks: () => void;

  constructor(codeOfSource: number) {
    switch (codeOfSource) {
      case 1:
        this.scrumAndGetMarks = getModels;
    }
  }

  public setMarks(marks: Imark[]) {
    this.marks = marks;
  }

  public getMarks() {
    return this.marks;
  }

  public async updateMarks() {
    const marks: any = await this.scrumAndGetMarks();
    console.log("marks", marks);
    await this.setMarks(marks);
  }
}
