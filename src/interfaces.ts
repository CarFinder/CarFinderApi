import { Document } from "mongoose";

export interface InterfacePerson extends Document {
    name?: string;
    age?: number;
    project?: string;
    role?: string;
}
