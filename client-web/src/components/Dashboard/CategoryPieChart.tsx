import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/user.context";
import { useGetCashDetailsQuery } from "@/services/cash.service";
import type { ExpenseCategory } from "@/utils/types"; // Import the type
import { useMemo } from "react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// Reuse the colors map, or better yet, this could be in a shared constant file
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

export const CategoryPieChart = () => {

    const context = useUserContext();
    const user = useMemo(() => context.user, [context.user]);

    const { data: cashDetailsResponse, isLoading } = useGetCashDetailsQuery(user?.id || "", {
        skip: !user?.id,
    });


    const cashDetails = useMemo(() => cashDetailsResponse?.data, [cashDetailsResponse]);

    const categoryData = useMemo(() => {
        return cashDetails?.categoryDistribution?.map(item => ({
            name: item.category,
            value: item._sum.amount,
            // Color is handled by the component now
        })) || [];
    }, [cashDetails]);

    // Ensure colors are applied if not passed
    const chartData = categoryData.map(item => ({
        ...item,
        color: CATEGORY_COLORS[item.name] || CATEGORY_COLORS.OTHER,
    }));

    if (isLoading) {
        return <CategoryPieChartLoader />;
    }

    return (
        <Card className="glass-card border-border/50 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-wide">
                    By Category
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[220px] w-full overflow-hidden relative">
                    {/* Center Text (Optional: Total or nice graphic) */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className="hover:opacity-80 transition-opacity cursor-pointer stroke-background stroke-2"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "12px",
                                    color: "hsl(var(--foreground))",
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                // formatter={(value: string, name: string) => [`₹${(Number(value) || 0).toLocaleString()}`, name]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                    {chartData.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-2 group cursor-default">
                            <div
                                className="w-3 h-3 rounded-full shadow-sm ring-2 ring-transparent group-hover:ring-offset-1 group-hover:ring-current transition-all"
                                style={{ backgroundColor: cat.color, color: cat.color }}
                            />
                            <span className="text-sm text-muted-foreground font-medium truncate">
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const CategoryPieChartLoader = () => {
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
};
