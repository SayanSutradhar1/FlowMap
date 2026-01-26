import { Router } from "express";
import {
  GetSignedInUser,
  SignIn,
  SignOut,
} from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.route("/signin").post(SignIn);
authRouter.route("/signout").post(SignOut);
authRouter.route("/get").get(AuthMiddleware, GetSignedInUser);

export default authRouter;
