import { Router } from "express";
import { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { isgoauthLogin, verifyJWT } from "../middlewares/auth";
import { loginHandler, logoutHandler, sendotpHandler, signupHandler } from "../controllers/auth";
import upload from "../utils/multerInitialise";

const AuthRouter:Router = Router();

AuthRouter.use("/google/logout", (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
    console.log("Logged out");
  });
});

AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);


AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

AuthRouter.get("/protected", isgoauthLogin, (req: Request, res: Response) => {
  // @ts-expect-error
  let name = req.user?.displayName;
  res.send("You are authenticated");
});

AuthRouter.get("/google/failure", (req: Request, res: Response) => {
  res.send("Something went wrong");
});

AuthRouter.post("/generate_otp",sendotpHandler);
AuthRouter.post("/signup", upload.single("file"), signupHandler);
AuthRouter.post("/login",loginHandler);
AuthRouter.post("/logout",verifyJWT,logoutHandler);

export default AuthRouter;