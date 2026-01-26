import { Router } from "express";
import {
    AddNewExpense,
    DeleteExpense,
    GetAllExpenses,
    GetExpenses,
    UpdateExpense,
    GetMonthlyExpenses,
} from "../controllers/expense.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const expenseRouter = Router();

expenseRouter.route("/add").post(AddNewExpense);
expenseRouter.route("/delete/:id").delete(DeleteExpense);
expenseRouter.route("/update/:id").patch(UpdateExpense);
expenseRouter.route("/all").get(AuthMiddleware, GetAllExpenses);
expenseRouter.route("/get/:id").get(AuthMiddleware, GetExpenses);
expenseRouter.route("/getMonthlyExpenses/:id").get(AuthMiddleware, GetMonthlyExpenses);

export default expenseRouter;

