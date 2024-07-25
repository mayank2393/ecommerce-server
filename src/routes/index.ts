import { Router } from "express";
import AuthRouter from "./authRoutes";
import CustomerRouter from "./customerRoutes";
import SellerRouter from "./sellerRoutes";
import AdminRouter from "./adminRoutes";
import ProductRouter from "./productRoutes";
import CategoriesRouter from "./categoriesRoutes";
import GenericUserRouter from "./genericUser";

const RootRouter:Router = Router();

RootRouter.use("/auth", AuthRouter);
RootRouter.use("/user", GenericUserRouter);
RootRouter.use("/customer", CustomerRouter);
RootRouter.use("/seller",SellerRouter);
RootRouter.use("/admin",AdminRouter);
RootRouter.use("/product",ProductRouter);
RootRouter.use("/category",CategoriesRouter);


export default RootRouter;