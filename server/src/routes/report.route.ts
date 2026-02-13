import { Router } from "express";
import { GetTransactionsReport } from "../controllers/reports.controller";

const reportRouter = Router();

reportRouter.route("/transactions/:id").get(GetTransactionsReport);

export default reportRouter;