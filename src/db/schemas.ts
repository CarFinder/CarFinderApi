import { Schema } from "mongoose";

export const userSchema = new Schema(
    {
        age: Number,
        name: String,
        project: String,
        role: String
    },
    { strict: false, collection: "userData" }
);

export const petSchema = new Schema(
    {
        age: String,
        name: String,
        ownerName: String,
        type: String
    },
    { strict: true, collection: "pets" }
);
