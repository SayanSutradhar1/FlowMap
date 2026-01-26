import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/user.context";
import { useGetCashDetailsQuery, useGetTransactionsQuery } from "@/services/cash.service";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TransactionType, ExpenseCategory } from "@/utils/types";

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  EDUCATION: "#3b82f6", // Blue
  HEALTH: "#10b981", // Emerald
  TRAVEL: "#f59e0b", // Amber
  FOOD: "#14b8a6", // Teal
  ENTERTAINMENT: "#8b5cf6", // Violet
  BILL: "#ef4444", // Red
  HOUSING: "#ec4899", // Pink
  ELECTRONICS: "#6366f1", // Indigo
  CLOTHING: "#d946ef", // Fuchsia
  INVESTS: "#22c55e", // Green
  MISCELLANEOUS: "#64748b", // Slate
  OTHER: "#94a3b8", // Gray
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DashboardOverview = () => {
  const context = useUserContext();

  const user = useMemo(() => context.user, [context.user]);

  const { data: recentTransactionsResponse } = useGetTransactionsQuery({ id: user?.id || "", recent: true }, {
    skip: !user?.id,
  });

  const recentTransactions = useMemo(() => recentTransactionsResponse?.data, [recentTransactionsResponse]);

  const { data: cashDetailsResponse } = useGetCashDetailsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const cashDetails = useMemo(() => cashDetailsResponse?.data, [cashDetailsResponse]);


  const stats = useMemo(() => [
    {
      title: "Total Balance",
      value: cashDetails?.amount,
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      color: "from-primary to-primary/60",
    },
    {
      title: "Monthly Expenses",
      value: cashDetails?.monthlyExpense,
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "from-accent to-accent/60",
    },
    {
      title: "Savings This Month",
      value: cashDetails?.monthlySavings,
      change: "-3.1%",
      trend: "down",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-500/60",
    },
    {
      title: "Budget Used",
      value: "",
      change: "On Track",
      trend: "neutral",
      icon: Target,
      color: "from-violet-500 to-violet-500/60",
    },
  ], [cashDetails, cashDetailsResponse])

  const weeklyData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(day => {
      const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });
      // This is an approximation as we only have 'recent' transactions. 
      // Ideally, we'd query for a date range.
      const amount = recentTransactions
        ?.filter(t =>
          new Date(t.createdAt).toDateString() === day.toDateString() &&
          t.transactionType === "OUT"
        )
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      return { day: dayStr, amount };
    });
  }, [recentTransactions]);

  const categoryData = useMemo(() => {
    return cashDetails?.categoryDistribution?.map(item => ({
      name: item.category,
      value: item._sum.amount,
      color: CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER
    })) || [];
  }, [cashDetails]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full overflow-x-hidden"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-bold">
          Welcome back, <span className="gradient-text">John!</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your finances today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span
                        className={`text-sm ${stat.trend === "up"
                          ? "text-emerald-500"
                          : stat.trend === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                          }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Weekly Spending Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Weekly Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient
                        id="colorAmount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                By Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Transactions
            </CardTitle>
            <Link to="/dashboard/transactions" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions?.map((transaction: TransactionType, index: number) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.transactionType === "IN"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-red-500/20 text-red-500"
                        }`}
                    >
                      {transaction.transactionType === "IN" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.transactionType === "IN" ? "Income" : "Expense"}
                      </p>
                      <p className="text-sm text-muted-foreground flex flex-col">
                        <span className="text-xs text-muted-foreground/80 font-mono">
                          ID: {transaction.id.substring(0, 8)}...
                        </span>
                        <span>
                          {transaction.transactionType === "IN" ? transaction.transactionDetails?.description : transaction.transactionDetails?.description}
                        </span>
                        <span>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${transaction.transactionType === "IN"
                        ? "text-emerald-500"
                        : "text-foreground"
                        }`}
                    >
                      {transaction.transactionType === "IN" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {!recentTransactions?.length && (
                <div className="text-center py-4 text-muted-foreground">
                  No recent transactions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
