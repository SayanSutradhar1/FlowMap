import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/user.context";
import { useGetCashDetailsQuery, useGetTransactionsQuery } from "@/services/cash.service";
import type { TransactionType } from "@/utils/types";
import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CategoryPieChart } from "../../components/Dashboard/CategoryPieChart";
import { WeeklySpendingChart } from "../../components/Dashboard/WeeklySpendingChart";
import ListSkeleton from "@/components/Layout/Skeletons/ListSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const { data: recentTransactionsResponse, isLoading: isTransactionsLoading } = useGetTransactionsQuery({ id: user?.id || "", recent: true }, {
    skip: !user?.id,
  });

  const recentTransactions = useMemo(() => recentTransactionsResponse?.data, [recentTransactionsResponse]);

  const { data: cashDetailsResponse, isLoading: isCashLoading } = useGetCashDetailsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const cashDetails = useMemo(() => cashDetailsResponse?.data, [cashDetailsResponse]);

  const isLoading = isCashLoading;

  const stats = useMemo(() => [
    {
      title: "Total Balance",
      value: cashDetails?.amount,
      icon: Wallet,
      color: "from-primary to-primary/60",
    },
    {
      title: "Monthly Expenses",
      value: cashDetails?.monthlyExpense,
      icon: CreditCard,
      color: "from-accent to-accent/60",
    },
    {
      title: "Savings This Month",
      value: cashDetails?.monthlySavings,
      icon: cashDetails?.monthlySavings && cashDetails?.monthlySavings > 0 ? TrendingUp : TrendingDown,
      color: cashDetails?.monthlySavings && cashDetails?.monthlySavings > 0 ? "from-emerald-500 to-emerald-500/60" : "from-red-500 to-red-500/60",
    },
  ], [cashDetails])

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
      {/* Stats Grid */}
      {isLoading ? (
        <StatsGridSkeleton />
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
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
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Weekly Spending Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <WeeklySpendingChart />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants}>
          <CategoryPieChart />
        </motion.div>
      </div>

      {/* Recent Transactions */}

      {
        isTransactionsLoading ? <ListSkeleton /> :
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions?.transactions?.map((transaction: TransactionType) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="truncate max-w-[200px] font-medium">
                              {transaction.transactionDetails?.description || "No Description"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.transactionType === "IN"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-red-500/20 text-red-500"
                                }`}
                            >
                              {transaction.transactionType === "IN" ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                            </div>
                            <span className={transaction.transactionType === "IN" ? "text-emerald-500" : "text-red-500"}>
                              {transaction.transactionType === "IN" ? "Inflow" : "Outflow"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${transaction.transactionType === "IN" ? "text-emerald-500" : "text-foreground"}`}>
                            {transaction.transactionType === "IN" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{transaction.currentBalance?.toLocaleString() || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!recentTransactions?.transactions?.length && (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent transactions found
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
      }
    </motion.div>
  );
};


const StatsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default DashboardOverview;
