import express from "express";
import setUpRouter from "./router.js";

const app = express();

setUpRouter(app);

export default app;