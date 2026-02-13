import { Router } from "express";
import {
  AbortVerification,
  GetUser,
  GetUserByEmail,
  NewUser,
  RemoveUser,
  VerifyUser
} from "../controllers/user.controller";
import { CheckUserExistance } from "../middlewares/user.middleware";

const userRouter = Router();

userRouter.route("/signup").post(NewUser);
userRouter.route("/delete/:id").delete(CheckUserExistance, RemoveUser);
userRouter.route("/get/:id").get(CheckUserExistance, GetUser);
userRouter.route("/get/:email").get(CheckUserExistance, GetUserByEmail);
userRouter.route("/verify").post(VerifyUser);
userRouter.route("/abort").post(AbortVerification);

export default userRouter;
