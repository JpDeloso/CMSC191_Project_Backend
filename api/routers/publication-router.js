import express from "express";

// import functions from controller
import {
    getTestPublication
} from "../controllers/publication-controller.js";

const publicationRouter = express.Router();

// initialize HTTP methods
publicationRouter.get("/getTestPublication", getTestPublication);

export default publicationRouter;