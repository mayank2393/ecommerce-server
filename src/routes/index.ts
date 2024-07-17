import { Router } from "express";
import AuthRouter from "./AuthRouter";

const RootRouter:Router = Router();

RootRouter.use("/auth", AuthRouter);

export default RootRouter;