import express from "express";

// import functions from controller
import {
    fullSearch,
    getTestPublication,
    searchByTitle,
    searchByAuthor,
    searchByIndexTerms
} from "../controllers/publication-controller.js";

const publicationRouter = express.Router();

// Test endpoint
publicationRouter.get("/getTestPublication", getTestPublication);

// Search endpoints - all using POST to accept JSON body
publicationRouter.post("/fullSearch", fullSearch);
publicationRouter.post("/search/title", searchByTitle);
publicationRouter.post("/search/author", searchByAuthor);
publicationRouter.post("/search/index-terms", searchByIndexTerms);

export default publicationRouter;
