import express from "express";

// import functions from controller
import {
    fullSearch,
    getTestPublication
} from "../controllers/publication-controller.js";

const publicationRouter = express.Router();

// initialize HTTP methods
publicationRouter.get("/getTestPublication", getTestPublication);
publicationRouter.post("/fullSearch", fullSearch)

export default publicationRouter;