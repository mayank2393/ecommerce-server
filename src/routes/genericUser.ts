import { Router } from "express";
import { verifyJWT } from "../middlewares/auth";
import { deleteAccount,  updateProfile, viewProfile } from "../controllers/genericUser";
import upload from "../utils/multerInitialise";

const GenericUserRouter:Router = Router();

GenericUserRouter.get("/profile", verifyJWT, viewProfile);
GenericUserRouter.put("/edit_profile",verifyJWT,upload.single("file"),updateProfile);
GenericUserRouter.delete("/delete_profile",verifyJWT,deleteAccount);


export default GenericUserRouter;