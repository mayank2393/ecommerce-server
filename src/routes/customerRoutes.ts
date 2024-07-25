import { Router } from "express";
import CartRouter from "./cartRoutes";
import { CustomerAuth, verifyJWT } from "../middlewares/auth";
import { addToWishlist, deleteProductFromWishlist, deleteReview, getOrders, getOrdersById, getReviews, getWishlists, initiateOrder, postReview, updateReview} from "../controllers/customer";

const CustomerRouter:Router = Router();

// Cart Routes of particular user/customer
CustomerRouter.use("/cart",CartRouter);

// Order Related Routes
CustomerRouter.post("/order",verifyJWT,CustomerAuth,initiateOrder);
CustomerRouter.get("/order",verifyJWT,CustomerAuth,getOrders);
CustomerRouter.get("/order/:id",verifyJWT,CustomerAuth,getOrdersById);

// Wishlist Related Routes
CustomerRouter.post("/wishlist",verifyJWT,CustomerAuth,addToWishlist);
CustomerRouter.get("/wishlist",verifyJWT,CustomerAuth,getWishlists);
CustomerRouter.delete("/wishlist/:product_id",verifyJWT,CustomerAuth,deleteProductFromWishlist);

// Review Related Routes
CustomerRouter.post("/review/:product_id",verifyJWT,CustomerAuth,postReview);
CustomerRouter.get("/reviews",verifyJWT,CustomerAuth,getReviews);
CustomerRouter.put("/review/:id",verifyJWT,CustomerAuth,updateReview);
CustomerRouter.delete("/review/:id",verifyJWT,CustomerAuth,deleteReview);

export default CustomerRouter;