import { db } from "../config/prisma";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const GetBudgetDetails = Wrapper(async (req, res) => {
  const { id } = req.params;

  const budgets = await db.budget.findMany({
    where: {
      userId: String(id),
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });

  const data = await Promise.all(
    budgets.map(async (budget) => {
      const budgetAmount = budget.amount;
      const category = budget.category;
      const sum = await db.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: String(id),
          category: category,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });
      const amount = sum._sum.amount || 0;

      return {
        category,
        amount,
        budgetAmount,
      };
    }),
  );

  SendJSONResponse(res, true, 200, "Budget Details Fetched Successfully", data);
  return;
});

const UpdateBudget = Wrapper(async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;

  const budget = await db.budget.upsert({
    where: {
      userId_category: {
        userId: String(id),
        category: category,
      },
    },
    create: {
      userId: String(id),
      category,
      amount,
    },
    update: {
      amount,
    },
  });

  SendJSONResponse(res, true, 200, "Budget Updated Successfully", budget);
  return;
});

export { GetBudgetDetails, UpdateBudget };
