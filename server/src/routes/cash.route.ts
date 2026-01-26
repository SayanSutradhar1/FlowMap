import { Router } from "express";
import {
  GetCash,
  GetMonthlySavings,
  GetTransactions,
  SetDailyLimit,
  GetCashDetails,
  GetMonthlyInflow,
  GetInflows,
  AddInflow,
} from "../controllers/cash.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const cashRouter = Router();

cashRouter.route("/setLimit/:id").post(AuthMiddleware, SetDailyLimit);
cashRouter.route("/get/:id").get(GetCash);
cashRouter.route("/transactions/:id").get(GetTransactions);
cashRouter.route("/getMonthlySavings/:id").get(GetMonthlySavings);
cashRouter.route("/getCashDetails/:id").get(GetCashDetails);
cashRouter.route("/getMonthlyInflow/:id").get(GetMonthlyInflow);
cashRouter.route("/getInflows/:id").get(GetInflows);
cashRouter.route("/addInflow").post( AddInflow);

export default cashRouter;
