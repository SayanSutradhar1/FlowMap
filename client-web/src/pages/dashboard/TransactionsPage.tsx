import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
    Calendar,
    Filter,
    Search,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useState } from "react";

import { useUserContext } from "@/context/user.context";
import { useGetTransactionsQuery } from "@/services/cash.service";
import type { TransactionType } from "@/utils/types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const TransactionsPage = () => {
    const { user } = useUserContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

    const { data: transactionsData } = useGetTransactionsQuery({
        id: user?.id || "",
        // Pass date filters to backend if both are present, or rely on client filtering?
        // Since ExpensesPage does client side, and we want to allow selecting only 'from', let's fetch all (or recent ones if default limits) and filter client side for now unless dataset is huge.
        // But cash.service supports 'f' and 't'. Let's use them if available.
        f: dateRange.from || undefined,
        t: dateRange.to || undefined
    }, {
        skip: !user?.id
    });

    const transactions = transactionsData?.data || [];

    const filteredTransactions = transactions.filter((transaction: TransactionType) => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || transaction.transactionType === typeFilter;
        // Date filtering is handled by backend if params passed. 
        // If only one date is set, the backend logic might expect both or one.
        // cash.service passes if t && f, or t, or f. So it handles partials.
        return matchesSearch && matchesType;
    });

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
                    <h1 className="text-3xl font-display font-bold">Transactions</h1>
                    <p className="text-muted-foreground mt-1">View and filter all your financial transactions</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4 w-full">
                                <div className="relative flex-1 min-w-[200px] max-w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-muted/50"
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[200px] bg-muted/50">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Transaction Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="IN">Income</SelectItem>
                                        <SelectItem value="OUT">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant={showDateFilter || (dateRange.from || dateRange.to) ? "secondary" : "outline"}
                                    className="gap-2"
                                    onClick={() => setShowDateFilter(!showDateFilter)}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Date Range
                                    {(dateRange.from || dateRange.to) && (
                                        <span className="ml-1 w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </Button>
                            </div>

                            {/* Date Range Collapsible */}
                            <motion.div
                                initial={false}
                                animate={{ height: showDateFilter ? "auto" : 0, opacity: showDateFilter ? 1 : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">From</Label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 w-[160px]"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">To</Label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 w-[160px]"
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                        />
                                    </div>
                                    {(dateRange.from || dateRange.to) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDateRange({ from: "", to: "" })}
                                            className="text-muted-foreground hover:text-foreground mb-0.5"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Transactions List */}
            <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span>All Transactions ({filteredTransactions.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredTransactions.map((transaction: TransactionType, index: number) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:bg-accent/5 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.transactionType === "IN"
                                                ? "bg-emerald-500/20 text-emerald-500"
                                                : "bg-red-500/20 text-red-500"
                                                }`}
                                        >
                                            {transaction.transactionType === "IN" ? (
                                                <TrendingUp className="w-6 h-6" />
                                            ) : (
                                                <TrendingDown className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {transaction.transactionType === "IN" ? "Income" : "Expense"}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                                <span className="font-mono text-xs opacity-70">
                                                    ID: {transaction.id.substring(0, 8)}...
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold text-base ${transaction.transactionType === "IN"
                                                ? "text-emerald-500"
                                                : "text-foreground"
                                                }`}
                                        >
                                            {transaction.transactionType === "IN" ? "+" : "-"}₹
                                            {transaction.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {!filteredTransactions.length && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No transactions found matching your criteria.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default TransactionsPage;
