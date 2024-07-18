import { Router } from "express";
import AuthRouter from "./authRoutes";
import CustomerRouter from "./customerRoutes";
import SellerRouter from "./sellerRoutes";
import AdminRouter from "./adminRoutes";
import ProductRouter from "./productRoutes";
import CartRouter from "./cartRoutes";
import CategoriesRouter from "./categoriesRoutes";

const RootRouter:Router = Router();

RootRouter.use("/auth", AuthRouter);
RootRouter.use("/customer", CustomerRouter);
RootRouter.use("/seller",SellerRouter);
RootRouter.use("/admin",AdminRouter);
RootRouter.use("/product",ProductRouter);
RootRouter.use("/cart",CartRouter);
RootRouter.use("/category",CategoriesRouter);

export default RootRouter;