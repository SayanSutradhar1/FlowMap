import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/user.context";
import { useGetTransactionsQuery } from "@/services/cash.service";
import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Skeleton } from "../ui/skeleton";


export const WeeklySpendingChart = () => {

    const context = useUserContext();
    const user = useMemo(() => context.user, [context.user]);

    const { data: recentTransactionsResponse,isLoading } = useGetTransactionsQuery({ id: user?.id || "", recent: true }, {
        skip: !user?.id,
    });


    const recentTransactions = useMemo(() => recentTransactionsResponse?.data, [recentTransactionsResponse]);


    const weeklyData = useMemo(() => {
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return d;
        });

        return last7Days.map(day => {
            const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });
            const amount = recentTransactions?.transactions
                ?.filter(t =>
                    new Date(t.createdAt).toDateString() === day.toDateString() &&
                    t.transactionType === "OUT"
                )
                .reduce((sum, t) => sum + t.amount, 0) || 0;

            return { day: dayStr, amount };
        });
    }, [recentTransactions]);

    if (isLoading) {
        return <WeeklySpendingChartSkeleton />;
    }

    return (
        <Card className="glass-card border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-wide">
                    Weekly Spending
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                            <XAxis
                                dataKey="day"
                                stroke="hsl(var(--muted-foreground))"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#8b5cf6", fontSize: 13, fontWeight: 600 }}
                                tickMargin={10}
                                allowDataOverflow={false} // Prevent overflow issues
                                interval="preserveStartEnd" // Ensure start/end labels show
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `₹${value}`}
                                tick={{ fill: "#8b5cf6", fontSize: 13, fontWeight: 600 }}
                                tickMargin={10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    color: "hsl(var(--foreground))",
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeDasharray: "4 4" }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#8b5cf6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                                animationDuration={1500}
                                activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};


const WeeklySpendingChartSkeleton = () => {
    return (
        <Card className="glass-card border-border/50 h-full">
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
                <div className="h-[220px] w-full flex items-center justify-center relative">
                    <Skeleton className="h-48 w-48 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
