import express from "express";

// import functions from controller
import {
    getTestUser
} from "../controllers/user-controller.js";

const userRouter = express.Router();

// initialize HTTP methods
userRouter.get("/getTestUser", getTestUser);

export default userRouter;