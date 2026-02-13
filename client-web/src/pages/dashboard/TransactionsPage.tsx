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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
    Calendar,
    Filter,
    Search,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";

import ListSkeleton from "@/components/Layout/Skeletons/ListSkeleton";
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
    const [currentPage, setCurrentPage] = useState(1);

    const { data: transactionInitialResponse, isLoading } = useGetTransactionsQuery({
        id: user?.id || "",
        // Pass date filters to backend if both are present, or rely on client filtering?
        // Since ExpensesPage does client side, and we want to allow selecting only 'from', let's fetch all (or recent ones if default limits) and filter client side for now unless dataset is huge.
        // But cash.service supports 'f' and 't'. Let's use them if available.
        f: dateRange.from || undefined,
        t: dateRange.to || undefined,
        take: 10,
        skip: (currentPage - 1) * 10,
    }, {
        skip: !user?.id
    });

    const transactions = useMemo(() => {
        return transactionInitialResponse?.data?.transactions || []
    }, [transactionInitialResponse])

    const filteredTransactions = transactions.filter((transaction: TransactionType) => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || transaction.transactionType === typeFilter;
        // Date filtering is handled by backend if params passed. 
        // If only one date is set, the backend logic might expect both or one.
        // cash.service passes if t && f, or t, or f. So it handles partials.
        return matchesSearch && matchesType;
    });

    const handleChangePage = (change: "next" | "previous") => {

        if (change === "next" && transactions.length < 10) return
        if (change === "previous" && currentPage === 1) return

        if (change === "next") {
            setCurrentPage((prev) => prev + 1)
        } else {
            setCurrentPage((prev) => prev - 1)
        }

        window.scrollTo({ top: 0, behavior: "smooth" })
    }

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

            {
                isLoading ? <ListSkeleton /> : <motion.div variants={itemVariants}>
                    <Card className="glass-card border-border/50">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                <span>All Transactions ({filteredTransactions.length})({transactionInitialResponse?.data?.count})</span>
                            </CardTitle>
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                <span>Page : {currentPage}/{Math.ceil((transactionInitialResponse?.data?.count ?? 0) / 10)}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.transactionType === "IN"
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
                                                    <span className={`text-sm font-medium px-2 py-1 rounded-md ${transaction.transactionType === "IN"
                                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-600 border border-red-500/20"
                                                        }`}>
                                                        {transaction.transactionType === "IN" ? "Income" : "Expense"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">
                                                    {transaction.transactionDetails?.description || "N/A"}
                                                </span>
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${transaction.transactionType === "IN"
                                                ? "text-emerald-500"
                                                : "text-foreground"
                                                }`}>
                                                {transaction.transactionType === "IN" ? "+" : "-"}₹
                                                {transaction.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₹{transaction.currentBalance?.toLocaleString() || "0"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {!filteredTransactions.length && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No transactions found matching your criteria.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            }
            <div className="flex items-center justify-end gap-2 mr-4">
                <Button variant="outline" onClick={() => handleChangePage("previous")}>
                    Previous
                </Button>
                <Button variant="outline" onClick={() => handleChangePage("next")}>
                    Next
                </Button>
            </div>
        </motion.div>
    );
};

export default TransactionsPage;
