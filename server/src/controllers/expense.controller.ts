import jwt from "jsonwebtoken";
import { db } from "../config/prisma";
import { redis } from "../main";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const AddNewExpense = Wrapper(async (req, res) => {
  // Path -> /api/expense/add

  const { name, userId, amount, category, description, recoverable } = req.body;

  let cash = JSON.parse((await redis.get(`cash_user:${userId}`)) || "null");

  if (!cash) {
    cash = await db.cash.findUnique({
      where: {
        userId,
      },
    });

    await redis.setex(`cash_user:${userId}`, 60 * 10, JSON.stringify(cash));
  }

  const dailiLimit = cash?.dailyLimit || 100;

  const currentDayTotalExpenseAmount = await db.cash.aggregate({
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  console.log(currentDayTotalExpenseAmount);

  const currentDayTotalExpense = currentDayTotalExpenseAmount._sum.amount || 0;

  if (currentDayTotalExpense + amount > dailiLimit) {
    SendJSONResponse(res, false, 400, "Daily limit exceeded");
    return;
  }

  const expense = await db.expense.create({
    data: {
      userId,
      name,
      amount,
      category,
      description,
      recoverable,
    },
  });

  await db.transaction.create({
    data: {
      userId,
      amount,
      transactionType: "OUT",
      refId: expense.id,
    },
  });

  if (!expense) {
    SendJSONResponse(res, false, 400, "Failed to add expense");
    return;
  }

  await redis.del(`expense_user:${userId}`);

  await redis.setex(`expense_${expense.id}`, 60 * 10, JSON.stringify(expense));

  await db.cash.update({
    where: {
      userId,
    },
    data: {
      amount: {
        decrement: amount,
      },
    },
  });

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      expenses: {
        connect: { id: expense.id },
      },
      cash: {
        update: {
          amount: {
            decrement: amount,
          },
        },
      },
    },
  });

  SendJSONResponse(res, true, 201, "Expense added successfully");
  return;
});

const DeleteExpense = Wrapper(async (req, res) => {
  const { id } = req.params;

  const expenseCache = JSON.parse((await redis.get(`expense_${id}`)) || "null");

  if (expenseCache) {
    await redis.del(`expense_${id}`);
  }

  const expense = await db.expense.findUnique({
    where: {
      id,
    },
  });

  if (!expense) {
    SendJSONResponse(res, false, 404, "Expense not found");
    return;
  }

  await db.expense.delete({
    where: {
      id,
    },
  });

  await db.cash.update({
    where: {
      userId: expense?.userId,
    },
    data: {
      amount: {
        increment: expense?.amount,
      },
    },
  });

  SendJSONResponse<typeof expense>(
    res,
    true,
    200,
    "Expense deleted successfully",
    expense,
  );
  return;
});

const UpdateExpense = Wrapper(async (req, res) => {
  const { id } = req.params;
  const { amount, category, description, recoverable } = req.body;

  let expense = JSON.parse((await redis.get(`expense_${id}`)) || "null");

  if (!expense) {
    expense = await db.expense.findUnique({
      where: {
        id,
      },
    });
  }

  if (!expense) {
    SendJSONResponse(res, false, 404, "Expense not found");
    return;
  }

  const updatedExpense = await db.expense.update({
    where: {
      id,
    },
    data: {
      amount,
      category,
      description,
      recoverable,
    },
  });

  if (!updatedExpense) {
    SendJSONResponse(res, false, 400, "Failed to update expense");
    return;
  }

  await db.cash.update({
    where: {
      userId: expense?.userId,
    },
    data: {
      amount: {
        increment: updatedExpense?.amount - (expense?.amount ?? 0),
      },
    },
  });

  SendJSONResponse<typeof updatedExpense>(
    res,
    true,
    200,
    "Expense updated successfully",
    updatedExpense,
  );
  return;
});

const GetAllExpenses = Wrapper(async (req, res) => {
  const token = req.cookies.token as string;

  const { id } = jwt.decode(token) as { id: string };

  console.log(id);

  let expenses = JSON.parse((await redis.get(`expenses_user:${id}`)) || "null");

  if (expenses) {
    SendJSONResponse(
      res,
      true,
      200,
      "Expenses fetched successfully (Redis)",
      expenses,
    );
    return;
  }

  let user = JSON.parse((await redis.get(`user_${id}`)) || "null");

  if (!user) {
    user = await db.user.findUnique({
      where: {
        id,
      },
    });

    await redis.setex(`user_${id}`, 60 * 10, JSON.stringify(user));
  }

  expenses = await db.expense.findMany({
    where: {
      userId: id?.toString(),
    },
  });

  redis.setex(`expenses_user:${id}`, 60 * 10, JSON.stringify(expenses));

  SendJSONResponse<typeof expenses>(
    res,
    true,
    200,
    "Expenses fetched successfully (DB)",
    expenses,
  );
  return;
});

const GetExpenses = Wrapper(async (req, res) => {
  const { id } = req.params;
  const { f, t } = req.query; // d -> Days

  let expenses = JSON.parse(
    (await redis.get(`expenses/d:${f}${t ? `/t:${t}` : ""}_user:${id}`)) ||
      "null",
  );

  if (expenses) {
    SendJSONResponse<typeof expenses>(
      res,
      true,
      200,
      "Expenses fetched successfully",
      expenses,
    );
    return;
  }

  expenses = await db.expense.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(f))),
        lte: t
          ? new Date(new Date().setDate(new Date().getDate() + Number(t)))
          : undefined,
      },
    },
  });

  redis.setex(
    `expenses/d:${f}${t ? `/t:${t}` : ""}_user:${id}`,
    60 * 10,
    JSON.stringify(expenses),
  );

  SendJSONResponse(res, true, 200, "Expenses fetched successfully", expenses);
  return;
});

const GetMonthlyExpenses = Wrapper(async (req, res) => {
  const { id } = req.params;
  const { month } = req.query;

  const expenses = await db.expense.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), Number(month) - 1, 1),
        lte: new Date(new Date().getFullYear(), Number(month), 1),
      },
    },
  });

  SendJSONResponse(res, true, 200, "Expenses fetched successfully", expenses);
  return;
});

export {
  AddNewExpense,
  DeleteExpense,
  GetAllExpenses,
  GetExpenses,
  UpdateExpense,
  GetMonthlyExpenses,
};
