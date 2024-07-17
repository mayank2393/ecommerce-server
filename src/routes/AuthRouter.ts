import { Router } from "express";
import { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { isgoauthLogin } from "../middlewares/auth";

const AuthRouter:Router = Router();

AuthRouter.use("/logout", (req: Request, res: Response) => {
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

export default AuthRouter;