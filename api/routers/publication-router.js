import express from "express";

// import functions from controller
import {
    fullSearch,
    getTestPublication,
    filterPublications
} from "../controllers/publication-controller.js";

const publicationRouter = express.Router();

// initialize HTTP methods
publicationRouter.get("/getTestPublication", getTestPublication);
publicationRouter.post("/fullSearch", fullSearch);
publicationRouter.post("/filterPublication", filterPublications);

export default publicationRouter;