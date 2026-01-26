import { db } from "../config/prisma";
import Wrapper from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";

const BasicAnalytics = Wrapper(async (req, res) => {
  const { id } = req.params;

  const expenses = await db.expense.findMany({
    where: { userId: id },
    select: { amount: true, createdAt: true, category: true },
  });

  const monthlyTotals = expenses.reduce(
    (acc, { amount, createdAt }) => {
      const month = createdAt.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const highestSpendingMonthData = Object.entries(monthlyTotals).reduce(
    (max, [month, amount]) => (amount > max.amount ? { month, amount } : max),
    { month: "N/A", amount: 0 },
  );

  const lowestSpendingMonthData = Object.entries(monthlyTotals).reduce(
    (min, [month, amount]) => (amount < min.amount ? { month, amount } : min),
    { month: "N/A", amount: 0 },
  );

  const avgMonthlySpending =
    Object.values(monthlyTotals).reduce((acc, amount) => acc + amount, 0) /
    Object.keys(monthlyTotals).length;

  const topCategory = expenses.reduce(
    (acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategoryData = Object.entries(topCategory).reduce(
    (max, [category, amount]) =>
      amount > max.amount ? { category, amount } : max,
    { category: "N/A", amount: 0 },
  );

  SendJSONResponse(res, true, 200, "Analytics fetched successfully", {
    highestSpendingMonthData,
    lowestSpendingMonthData,
    avgMonthlySpending,
    topCategoryData,
  });
});

const CoreAnalysisByMonth = Wrapper(async (req, res) => {
  const { id } = req.params;

  const currentMonth = new Date().getMonth();

  const expenses = await db.expense.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const inflows = await db.inflow.findMany({
    where: {
      userId: id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const monthlyTotalExpenses = expenses.reduce(
    (acc, { amount, createdAt }) => {
      const month = createdAt.getMonth();
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    },
    {} as Record<number, number>,
  );

  const monthlyExpenses = Array.from({ length: currentMonth + 1 }, (_, i) => ({
    month: i,
    amount: monthlyTotalExpenses[i] || 0,
  }));

  const monthlyTotalInflows = inflows.reduce(
    (acc, { amount, createdAt }) => {
      const month = createdAt.getMonth();
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    },
    {} as Record<number, number>,
  );

  const monthlyInflows = Array.from({ length: currentMonth + 1 }, (_, i) => ({
    month: i,
    amount: monthlyTotalInflows[i] || 0,
  }));

  const monthlySavings = Array.from({ length: currentMonth + 1 }, (_, i) => ({
    month: i,
    amount: monthlyInflows[i].amount - monthlyExpenses[i].amount,
  }));

  SendJSONResponse(res, true, 200, "Monthly analysis fetched successfully", {
    monthlyExpenses,
    monthlyInflows,
    monthlySavings,
  });
});

const GetCategoryDistribution = Wrapper(async (req, res) => {
  const { id } = req.params;

  const expenses = await db.expense.findMany({
    where: {
      userId: id,
    },
    select: {
      amount: true,
      category: true,
      createdAt: true,
    },
  });

  const monthlyGroups: Record<number, Record<string, number>> = {};

  expenses.forEach((expense) => {
    const month = expense.createdAt.getMonth();
    const category = expense.category;

    if (!monthlyGroups[month]) {
      monthlyGroups[month] = {};
    }

    monthlyGroups[month][category] =
      (monthlyGroups[month][category] || 0) + expense.amount;
  });

  const data = Object.entries(monthlyGroups).map(([month, categories]) => {
    let topCategory = "N/A";
    let topCategoryAmount = 0;

    Object.entries(categories).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    });

    return {
      month: Number(month),
      topCategory,
      topCategoryAmount,
    };
  });

  SendJSONResponse(
    res,
    true,
    200,
    "Category distribution fetched successfully",
    data,
  );
});

export { BasicAnalytics, CoreAnalysisByMonth, GetCategoryDistribution };
