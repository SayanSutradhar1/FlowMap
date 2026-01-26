import { Router } from "express";
import {
  BasicAnalytics,
  CoreAnalysisByMonth,
  GetCategoryDistribution,
} from "../controllers/analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/basic/:id", BasicAnalytics);
analyticsRouter.get("/monthly/:id", CoreAnalysisByMonth);
analyticsRouter.get("/category/:id", GetCategoryDistribution);

export default analyticsRouter;
