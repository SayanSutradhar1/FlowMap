import { Inflow } from "../../generated/prisma/browser";
import { db } from "../config/prisma";
import { redis } from "../main";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const AddInflow = Wrapper(async (req, res) => {
  // Path -> /api/cash/addInflow

  const { description, amount, userId } = req.body;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  let inflow: Inflow | undefined;

  await db.$transaction(async (tx) => {
    inflow = await tx.inflow.create({
      data: {
        userId,
        amount,
        description,
      },
    });

    const updatedCash = await tx.cash.update({
      where: {
        userId,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        amount,
        transactionType: "IN",
        refId: inflow.id,
        currentBalance: updatedCash.amount,
      },
    });
  });

  SendJSONResponse(res, true, 200, "Inflow added successfully", inflow);
  return;
});

const RecoverCash = Wrapper(async (req, res) => {

  // Path -> /api/cash/recoverCash/:id

  const { id } = req.params;
  const { expenseId, description } = req.body;

  await db.$transaction(async (tx) => {
    const expense = await tx.expense.update({
      where: {
        id: expenseId,
        userId: id,
        recoverable: true,
      },
      data: {
        recoverable: false,
      },
    });

    if (!expense) {
      SendJSONResponse(res, false, 404, "Expense not found");
      return;
    }

    await tx.cashRecovery.create({
      data: {
        expenseId,
        amount: expense.amount,
        description,
      },
    });

    const updatedCash = await tx.cash.update({
      where: {
        userId: id,
      },
      data: {
        amount: {
          increment: expense.amount,
        },
      },
    });

    const inflow = await tx.inflow.create({
      data: {
        userId: id,
        amount: expense.amount,
        description : `Cash Recovered from ${expense.name}`,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId: id,
        amount: expense.amount,
        transactionType: "IN",
        refId: inflow.id,
        currentBalance: updatedCash.amount,
      },
    });

    if (!transaction) {
      SendJSONResponse(
        res,
        false,
        404,
        "Transaction was not created... Process has been rolled back",
      );
      return;
    }
  });

  SendJSONResponse(res, true, 200, "Cash recovered successfully");
  return;
});

const GetCash = Wrapper(async (req, res) => {
  const { id } = req.params; // User Id

  const cash = await db.cash.findUnique({
    where: {
      userId: id,
    },
  });

  SendJSONResponse<typeof cash>(
    res,
    true,
    200,
    "Cash fetched successfully",
    cash,
  );
  return;
});

const SetDailyLimit = Wrapper(async (req, res) => {
  const { id } = req.params;
  const { dailyLimit } = req.body;

  if (dailyLimit < 0) {
    SendJSONResponse(res, false, 400, "Daily limit cannot be negative");
    return;
  }

  await db.cash.update({
    where: {
      userId: id,
    },
    data: {
      dailyLimit,
    },
  });

  SendJSONResponse(res, true, 200, "Daily limit set successfully");
  return;
});

const GetMonthlySavings = Wrapper(async (req, res) => {
  // Wrong Logic , To be fixed

  const { id } = req.params;
  const { month } = req.query;

  const totalInflow = await db.inflow.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), Number(month) - 1, 1),
        lte: new Date(new Date().getFullYear(), Number(month), 1),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalExpense = await db.expense.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), Number(month) - 1, 1),
        lte: new Date(new Date().getFullYear(), Number(month), 1),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const savings = totalInflow._sum.amount
    ? totalInflow._sum.amount - (totalExpense._sum.amount ?? 0)
    : 0;

  SendJSONResponse(res, true, 200, "Savings fetched successfully", savings);
  return;
});

const GetSavings = Wrapper(async (req, res) => {
  // Path -> /api/cash/getSavings/:id

  const { id } = req.params;
  const { f, t } = req.query;

  const totalInflow = await db.inflow.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(f))),
        lte: new Date(new Date().setDate(new Date().getDate() + Number(t))),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalExpense = await db.expense.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(f))),
        lte: new Date(new Date().setDate(new Date().getDate() + Number(t))),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const savings = totalInflow._sum.amount
    ? totalInflow._sum.amount - (totalExpense._sum.amount ?? 0)
    : 0;

  SendJSONResponse(res, true, 200, "Savings fetched successfully", savings);
  return;
});

const GetTransactions = Wrapper(async (req, res) => {
  // Path -> /api/cash/transactions/:id

  const { id } = req.params;
  const { f, t, recent, take, skip } = req.query;

  const transactions = await db.transaction.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: f
          ? new Date(new Date().setDate(new Date().getDate() - Number(f)))
          : undefined,
        lte: t
          ? new Date(new Date().setDate(new Date().getDate() + Number(t)))
          : undefined,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: take ? Number(take) : recent ? 5 : undefined,
    skip: skip ? Number(skip) : undefined,
  });

  const metaData = await db.transaction.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: f
          ? new Date(new Date().setDate(new Date().getDate() - Number(f)))
          : undefined,
        lte: t
          ? new Date(new Date().setDate(new Date().getDate() + Number(t)))
          : undefined,
      },
    },
    _count: {
      id: true,
    },
  });

  const inflowIds = transactions
    .filter((t) => t.transactionType === "IN")
    .map((t) => t.refId);
  const expenseIds = transactions
    .filter((t) => t.transactionType !== "IN")
    .map((t) => t.refId);

  const [inflows, expenses] = await Promise.all([
    db.inflow.findMany({
      where: { id: { in: inflowIds } },
      select: { amount: true, createdAt: true, id: true, description: true },
    }),
    db.expense.findMany({
      where: { id: { in: expenseIds } },
      select: { amount: true, createdAt: true, id: true, description: true },
    }),
  ]);

  const detailsMap = new Map<string, any>([
    ...inflows.map((i) => [i.id, i] as [string, any]),
    ...expenses.map((e) => [e.id, e] as [string, any]),
  ]);

  const result = transactions.map((transaction) => ({
    ...transaction,
    transactionDetails: detailsMap.get(transaction.refId) || null,
  }));

  SendJSONResponse(res, true, 200, "Transactions fetched successfully", {
    transactions: result,
    count: metaData._count.id,
  });
  return;
});

const GetCashDetails = Wrapper(async (req, res) => {
  // Path -> /api/cash/getCashDetails/:id

  const { id } = req.params;
  const cash = await db.cash.findUnique({
    where: {
      userId: id,
    },
  });

  const monthlyExpense = await db.expense.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(30))),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalMonthlyInflow = await db.inflow.aggregate({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(30))),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const categoryDistribution = await db.expense.groupBy({
    by: ["category"],
    _sum: {
      amount: true,
    },
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - Number(30))),
      },
    },
  });

  const data = {
    amount: cash?.amount,
    dailyLimit: cash?.dailyLimit,
    monthlyExpense: monthlyExpense._sum.amount ?? 0,
    monthlyInflow: totalMonthlyInflow._sum.amount ?? 0,
    monthlySavings: totalMonthlyInflow._sum.amount
      ? totalMonthlyInflow._sum.amount - (monthlyExpense._sum.amount ?? 0)
      : 0,
    categoryDistribution,
  };

  SendJSONResponse(res, true, 200, "Cash fetched successfully", data);
  return;
});

const GetMonthlyInflow = Wrapper(async (req, res) => {
  // Path -> /api/cash/getMonthlyInflow/:id

  const { id } = req.params;
  const { month } = req.query;

  const inflows = await db.inflow.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), Number(month) - 1, 1),
        lte: new Date(new Date().getFullYear(), Number(month), 1),
      },
    },
  });

  SendJSONResponse(
    res,
    true,
    200,
    "Monthly inflow fetched successfully",
    inflows,
  );
  return;
});

const GetInflows = Wrapper(async (req, res) => {
  // Path -> /api/cash/getInflows/:id

  const { id } = req.params;

  const { take, skip } = req.query;

  const inflows = await db.inflow.findMany({
    where: {
      userId: id,
    },
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const metaData = await db.inflow.aggregate({
    where: {
      userId: id,
    },
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
    },
  });

  const data = {
    inflows,
    count: metaData._count.id,
    totalAmount: metaData._sum.amount,
  };

  SendJSONResponse(res, true, 200, "Inflows fetched successfully", data);
  return;
});

export {
  RecoverCash,
  GetCash,
  SetDailyLimit,
  GetMonthlySavings,
  GetTransactions,
  GetCashDetails,
  GetSavings,
  GetMonthlyInflow,
  GetInflows,
  AddInflow,
};
