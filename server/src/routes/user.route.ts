import { Router } from "express";
import {
  GetUser,
  GetUserByEmail,
  NewUser,
  RemoveUser,
  VerifyUser,
} from "../controllers/user.controller";
import { CheckUserExistance } from "../middlewares/user.middleware";

const userRouter = Router();

userRouter.route("/signup").post(NewUser);
userRouter.route("/delete/:id").delete(CheckUserExistance, RemoveUser);
userRouter.route("/get/:id").get(CheckUserExistance, GetUser);
userRouter.route("/get/:email").get(CheckUserExistance, GetUserByEmail);
userRouter.route("/verify").patch(VerifyUser);

export default userRouter;
