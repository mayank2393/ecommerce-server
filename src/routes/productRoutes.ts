import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, getReviews, updateProduct } from "../controllers/product";
import { AdminAuth, SellerAuth, verifyJWT } from "../middlewares/auth";

const ProductRouter:Router = Router();

ProductRouter.post("/",verifyJWT,SellerAuth,createProduct);
ProductRouter.get("/",getProducts);
ProductRouter.get("/:id",getProductById);
ProductRouter.put("/:id",verifyJWT,SellerAuth,updateProduct);
ProductRouter.delete("/:id",verifyJWT,deleteProduct);
ProductRouter.get("/:id/reviews",getReviews);


export default ProductRouter;