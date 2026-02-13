import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/user.context";
import { useGetBasicAnalyticsQuery, useGetCategoryDistributionQuery, useGetMonthlyAnalyticsQuery } from "@/services/analytics.service";
import { useGetCashDetailsQuery } from "@/services/cash.service";
import { motion } from "framer-motion";
import { Calendar, Download, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// const yearlyComparison = [
//   { year: "2022", total: 480000 },
//   { year: "2023", total: 552000 },
//   { year: "2024", total: 320000 },
// ];

const CATEGORY_COLORS: Record<string, string> = {
  EDUCATION: "#14b8a6", // Teal
  HEALTH: "#f59e0b", // Amber
  TRAVEL: "#8b5cf6", // Violet
  FOOD: "#ef4444", // Red
  ENTERTAINMENT: "#3b82f6", // Blue
  BILL: "#6366f1", // Indigo
  HOUSING: "#ec4899", // Pink
  ELECTRONICS: "#06b6d4", // Cyan
  CLOTHING: "#10b981", // Emerald
  INVESTS: "#f97316", // Orange
  MISCELLANEOUS: "#6b7280", // Gray
  OTHER: "#84cc16", // Lime
};


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];





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

const AnalyticsPage = () => {

  const context = useUserContext();

  const user = useMemo(() => context.user, [context.user]);

  const { data: basicAnalyticsResponse } = useGetBasicAnalyticsQuery(user?.id || "", {
    skip: !user?.id
  })

  const { data: monthlyAnalyticsResponse } = useGetMonthlyAnalyticsQuery(user?.id || "", {
    skip: !user?.id
  })

  const { data: cashDetailsResponse } = useGetCashDetailsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const { data: monthlyCategoryDistributionResponse } = useGetCategoryDistributionQuery(user?.id || "", {
    skip: !user?.id,
  });

  const categoryDistribution = useMemo(() => cashDetailsResponse?.data?.categoryDistribution, [cashDetailsResponse?.data?.categoryDistribution]);

  const basicAnalytics = useMemo(() => basicAnalyticsResponse?.data, [basicAnalyticsResponse]);

  const monthlyAnalytics = useMemo(() => monthlyAnalyticsResponse?.data, [monthlyAnalyticsResponse]);

  const monthlyCategoryDistribution = useMemo(() => monthlyCategoryDistributionResponse?.data, [monthlyCategoryDistributionResponse]);

  const insights = useMemo(() => {
    if (!basicAnalytics) return [
      { title: "Highest Spending Month", value: "Loading...", change: "", trend: "neutral" },
      { title: "Lowest Spending Month", value: "Loading...", change: "", trend: "neutral" },
      { title: "Average Monthly Spending", value: "Loading...", change: "", trend: "neutral" },
      { title: "Top Spending Category", value: "Loading...", change: "", trend: "neutral" },
    ];

    return [
      {
        title: "Highest Spending Month",
        value: basicAnalytics.highestSpendingMonthData.month,
        change: `₹${basicAnalytics.highestSpendingMonthData.amount.toLocaleString()}`,
        trend: "up"
      },
      {
        title: "Lowest Spending Month",
        value: basicAnalytics.lowestSpendingMonthData.month,
        change: `₹${basicAnalytics.lowestSpendingMonthData.amount.toLocaleString()}`,
        trend: "down"
      },
      {
        title: "Average Monthly Spending",
        value: `₹${Math.round(basicAnalytics.avgMonthlySpending).toLocaleString()}`,
        change: "Monthly Average",
        trend: "neutral"
      },
      {
        title: "Top Spending Category",
        value: basicAnalytics.topCategoryData.category,
        change: `₹${basicAnalytics.topCategoryData.amount.toLocaleString()}`,
        trend: "neutral"
      },
    ];
  }, [basicAnalytics]);

  const monthlyData = useMemo(() => {
    if (!monthlyAnalytics) return [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthlyAnalytics.monthlyExpenses.map((expense) => {
      const inflow = monthlyAnalytics.monthlyInflows.find(i => i.month === expense.month);
      const savings = monthlyAnalytics.monthlySavings.find(s => s.month === expense.month);

      return {
        month: monthNames[expense.month],
        income: inflow?.amount || 0,
        expenses: expense.amount || 0,
        savings: savings?.amount || 0,
      };
    });
  }, [monthlyAnalytics]);



  const categoryBreakdown = useMemo(() => {
    if (!categoryDistribution) return [];

    return categoryDistribution.map((item) => ({
      name: item.category,
      value: item._sum.amount,
      color: CATEGORY_COLORS[item.category] || "#94a3b8", // Default slate
    })).filter(item => item.value > 0);
  }, [categoryDistribution]);

  const monthlyCatTrend = useMemo(() => {
    if (!monthlyCategoryDistribution) return [];

    return monthlyCategoryDistribution.map((item) => ({
      ...item,
      monthName: months[item.month],
    }));
  }, [monthlyCategoryDistribution]);

  const isLoading =
    !basicAnalyticsResponse ||
    !monthlyAnalyticsResponse ||
    !cashDetailsResponse ||
    !monthlyCategoryDistributionResponse;

  // ... (keep hooks)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full overflow-x-hidden"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Deep insights into your spending patterns
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            2024
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Insights Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{insight.title}</p>
                {
                  isLoading ? <Skeleton className="h-8 w-24 mt-2" /> : (
                    <p className="text-2xl font-bold mt-2">{insight.value}</p>
                  )
                }
                <div className="flex items-center gap-1 mt-2">
                  {insight.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-accent" />
                  ) : insight.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  ) : null}
                  <span className="text-sm text-muted-foreground">{insight.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Charts */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            {/* <TabsTrigger value="comparison">Year Comparison</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? <OverviewTabSkeleton /> : (
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Income vs Expenses vs Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="income"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorIncome)"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorExpenses)"
                        />
                        <Area
                          type="monotone"
                          dataKey="savings"
                          stroke="#14b8a6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSavings)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {isLoading ? <CategoriesTabSkeleton /> : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyCatTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="monthName" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-card border border-border p-2 rounded-lg shadow-sm">
                                    <p className="font-semibold">{data.monthName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Top: <span className="text-primary">{data.topCategory}</span>
                                    </p>
                                    <p className="text-sm font-bold">₹{data.topCategoryAmount}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="topCategoryAmount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* <TabsContent value="comparison">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Yearly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

const OverviewTabSkeleton = () => {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Income vs Expenses vs Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

const CategoriesTabSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-56 w-56 rounded-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-end justify-between gap-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;