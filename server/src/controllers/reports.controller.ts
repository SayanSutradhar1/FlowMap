import { db } from "../config/prisma";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const GetTransactionsReport = Wrapper(async (req, res) => {
  const { id } = req.params;

  const { m, y } = req.query;

  const startDate = new Date(
    Number(y ? y : new Date().getFullYear()),
    Number(m ? m : new Date().getMonth()),
    1,
  );

  const endDate = new Date(
    Number(y ? y : new Date().getFullYear()),
    Number(m ? m : new Date().getMonth()) + 1,
    0,
  );

  const transactions = await db.transaction.findMany({
    where: {
      userId: id as string,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      transactionType: true,
      refId: true,
      createdAt: true,
      currentBalance: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const inflowIds = transactions
    .filter((t) => t.transactionType === "IN")
    .map((t) => t.refId);

  const expenseIds = transactions
    .filter((t) => t.transactionType === "OUT")
    .map((t) => t.refId);

  const [inflows, expenses] = await Promise.all([
    db.inflow.findMany({
      where: {
        id: { in: inflowIds },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    db.expense.findMany({
      where: {
        id: { in: expenseIds },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const inflowMap = new Map(inflows.map((i) => [i.id, i]));
  const expenseMap = new Map(expenses.map((e) => [e.id, e]));

  const data = transactions
    .map((transaction) => {
      const type = transaction.transactionType;

      if (type === "IN") {
        const inflow = inflowMap.get(transaction.refId);

        if (inflow) {
          return {
            transactionId: transaction.id,
            amount: inflow.amount,
            type: transaction.transactionType,
            description: inflow.description,
            date: transaction.createdAt,
            cashIn: inflow.amount,
            cashOut: 0,
            currentBalance: transaction.currentBalance,
          };
        }
      } else {
        const expense = expenseMap.get(transaction.refId);

        if (expense) {
          return {
            transactionId: transaction.id,
            amount: expense.amount,
            type: transaction.transactionType,
            description: expense.description,
            date: transaction.createdAt,
            cashIn: 0,
            cashOut: expense.amount,
            currentBalance: transaction.currentBalance,
          };
        }
      }
      return null;
    })
    .filter((item) => item !== null);

  SendJSONResponse(res, true, 200, "Transactions found", data);
  return;
});

export { GetTransactionsReport };
