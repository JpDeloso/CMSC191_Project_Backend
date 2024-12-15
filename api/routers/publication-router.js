import express from "express";

// import functions from controller
import {
    fullSearch,
    getTestPublication,
    sortPublications
} from "../controllers/publication-controller.js";

const publicationRouter = express.Router();

// initialize HTTP methods
publicationRouter.get("/getTestPublication", getTestPublication);
publicationRouter.post("/fullSearch", fullSearch);
publicationRouter.post("/sortPublications", sortPublications);

export default publicationRouter;