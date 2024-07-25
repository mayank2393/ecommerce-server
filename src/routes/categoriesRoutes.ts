import { Router } from "express";
import { createCategory, getCategory } from "../controllers/category";
import { AdminAuth, verifyJWT } from "../middlewares/auth";

const CategoriesRouter:Router = Router();

CategoriesRouter.get("/",(req,res)=>getCategory);
CategoriesRouter.post("/",verifyJWT,AdminAuth,createCategory);

export default CategoriesRouter;