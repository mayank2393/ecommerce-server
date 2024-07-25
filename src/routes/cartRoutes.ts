import { Router } from "express";
import { getUserCart } from "../controllers/cart";
import { CustomerAuth, verifyJWT } from "../middlewares/auth";

const CartRouter:Router = Router();

CartRouter.get("/",verifyJWT,CustomerAuth,getUserCart);

export default CartRouter;