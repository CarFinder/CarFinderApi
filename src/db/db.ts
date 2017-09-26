import * as mongoose from "mongoose";
import { petSchema, userSchema } from "./schemas";

mongoose.connect("mongodb://localhost/testTSProjectDB");

const db = mongoose.connection;

const users = mongoose.model("users", userSchema);
const pets = mongoose.model("pets", petSchema);

export default {
    db,
    pets,
    users
};
