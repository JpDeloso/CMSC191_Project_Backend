import "module-alias/register.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import setUpRouter from "./router.js";
import { UserModel } from "../models/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await mongoose.connect(process.env.MONGOOSE_CONNSTR, {
    dbName: "prod"
});

setUpRouter(app);

// app.listen(5000, () => console.log("Listening to port 5000."));

export default app;