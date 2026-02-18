import jwt from "jsonwebtoken";
import { db } from "../config/prisma";
import { redis } from "../main";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const AddNewExpense = Wrapper(async (req, res) => {
  // Path -> /api/expense/add

  const { name, userId, amount, category, description, recoverable } = req.body;

  const cash = await db.cash.findUnique({
    where: {
      userId,
    },
  });

  if (!cash) {
    SendJSONResponse(res, false, 404, "Cash not found");
    return;
  }

  if (cash.amount < amount) {
    SendJSONResponse(res, false, 300, "Insufficient balance");
    return;
  }

  const dailiLimit = cash?.dailyLimit || 100;

  const currentDayTotalExpenseAmount = await db.expense.aggregate({
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

  await db.$transaction(async (tx) => {
    const expense = await tx.expense.create({
      data: {
        userId,
        name,
        amount,
        category,
        description,
        recoverable,
      },
    });

    const updatedCash = await tx.cash.update({
      where: {
        userId,
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        amount,
        transactionType: "OUT",
        refId: expense.id,
        currentBalance: updatedCash?.amount,
      },
    });
  });

  SendJSONResponse(res, true, 201, "Expense added successfully");
  return;
});

const DeleteExpense = Wrapper(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    SendJSONResponse(res, false, 400, "Invalid expense id");
    return;
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

  const deletedExpense = await db.expense.delete({
    where: {
      id,
    },
  });

  await db.transaction.deleteMany({
    where: {
      refId: deletedExpense.id,
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

  if (typeof id !== "string") {
    SendJSONResponse(res, false, 400, "Invalid expense id");
    return;
  }

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

  const { skip, take } = req.query;

  const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const expenses = await db.expense.findMany({
    where: {
      userId: id?.toString(),
    },
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const metaData = await db.expense.aggregate({
    where: {
      userId: id?.toString(),
    },
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
    },
  });

  const data = {
    expenses,
    count: metaData._count.id,
    total: metaData._sum.amount,
  };

  SendJSONResponse(res, true, 200, "Expenses fetched successfully (DB)", data);
  return;
});

const GetExpenses = Wrapper(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    SendJSONResponse(res, false, 400, "Invalid user id");
    return;
  }

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
      userId: id as string,
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
