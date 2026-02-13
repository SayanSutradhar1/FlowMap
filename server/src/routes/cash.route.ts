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
  RecoverCash,
} from "../controllers/cash.controller";

const cashRouter = Router();

cashRouter.route("/setLimit/:id").post(SetDailyLimit);
cashRouter.route("/get/:id").get(GetCash);
cashRouter.route("/transactions/:id").get(GetTransactions);
cashRouter.route("/getMonthlySavings/:id").get(GetMonthlySavings);
cashRouter.route("/getCashDetails/:id").get(GetCashDetails);
cashRouter.route("/getMonthlyInflow/:id").get(GetMonthlyInflow);
cashRouter.route("/getInflows/:id").get(GetInflows);
cashRouter.route("/addInflow").post( AddInflow);
cashRouter.route("/recoverCash/:id").post(RecoverCash);

export default cashRouter;
