import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import "./config/googleOauth";
import RootRouter from "./routes";

export const prisma = new PrismaClient();
const app: Express = express();
const PORT = process.env.PORT;
const viewsPath = path.join(__dirname, "view");

app.use(express.static(viewsPath));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  session({
    secret: "my$ecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// calling Routers
app.use("/api/v1/",RootRouter);

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "HomeView.html"));
});
// app.use("/auth/logout", (req: Request, res: Response) => {
//   req.session.destroy((err: any) => {
//     if (err) {
//       console.error(err);
//     }
//     res.redirect("/");
//     console.log("Logged out");
//   });
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/protected",
//     failureRedirect: "/auth/google/failure",
//   })
// );

// app.get("/auth/protected", isgoauthLogin, (req: Request, res: Response) => {
//   // @ts-expect-error
//   let name = req.user?.displayName;
//   res.send("You are authenticated");
// });

// app.get("/auth/google/failure", (req: Request, res: Response) => {
//   res.send("Something went wrong");
// });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
