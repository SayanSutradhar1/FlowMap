import { Router } from "express";
import { GetBudgetDetails, UpdateBudget } from "../controllers/budget.controller";

const budgetRouter = Router()

budgetRouter.route("/:id").get(GetBudgetDetails).put(UpdateBudget)

export default budgetRouter
