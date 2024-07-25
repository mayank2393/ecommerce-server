import { Router } from "express";
import CartRouter from "./cartRoutes";

const CustomerRouter:Router = Router();

// Cart Routes of particular user/customer
CustomerRouter.use("/cart",CartRouter);

export default CustomerRouter;