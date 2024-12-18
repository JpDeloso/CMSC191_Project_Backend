import authRouter from "./routers/auth-router.js";
import publicationRouter from "./routers/publication-router.js";
import userRouter from "./routers/user-router.js";

const setUpRouter = (app) => {
    app.get("/", (req, res) => res.send("Express Server"));
    
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/publication", publicationRouter)
}

export default setUpRouter;