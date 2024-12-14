import express from "express";

import {
    register,
    signIn
} from "../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/signIn", signIn);

export default authRouter;