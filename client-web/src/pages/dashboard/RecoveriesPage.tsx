import ListSkeleton from "@/components/Layout/Skeletons/ListSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserContext } from "@/context/user.context";
import {
    useGetAllCashRecoveriesQuery
} from "@/services/cash.service";
import { motion } from "framer-motion";
import {
    Calendar,
    Search,
    Undo2
} from "lucide-react";
import { useMemo, useState } from "react";

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

const RecoveriesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: "",
        to: "",
    });

    const [currentPage, setCurrentPage] = useState(1);

    const { user } = useUserContext();

    // Fetch recoveries
    const { data: recoveryResponse, isLoading } = useGetAllCashRecoveriesQuery({
        id: user?.id || "",
        take: 10,
        skip: (currentPage - 1) * 10,
    }, {
        skip: !user?.id,
    });

    const recoveries = useMemo(() => recoveryResponse?.data?.recoveries || [], [recoveryResponse?.data?.recoveries]);

    const filteredRecoveries = useMemo(() => {
        return recoveries.filter((recovery) => {
            const matchesSearch =
                recovery.expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (recovery.description && recovery.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                false;

            let matchesDate = true;
            if (dateRange.from) {
                matchesDate =
                    matchesDate && new Date(recovery.createdAt) >= new Date(dateRange.from);
            }
            if (dateRange.to) {
                const endDate = new Date(dateRange.to);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(recovery.createdAt) <= endDate;
            }

            return matchesSearch && matchesDate;
        });
    }, [recoveries, searchTerm, dateRange]);

    const handleChangePage = (change: "next" | "previous") => {
        if (change === "next" && recoveries.length < 10) return;
        if (change === "previous" && currentPage === 1) return;

        if (change === "next") {
            setCurrentPage((prev) => prev + 1);
        } else {
            setCurrentPage((prev) => prev - 1);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 w-full overflow-x-hidden"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-display font-bold">Recoveries</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track your cash recoveries from expenses
                    </p>
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
                                        placeholder="Search recoveries..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-muted/50"
                                    />
                                </div>
                                <Button
                                    variant={
                                        showDateFilter || (dateRange.from || dateRange.to)
                                            ? "secondary"
                                            : "outline"
                                    }
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
                                animate={{
                                    height: showDateFilter ? "auto" : 0,
                                    opacity: showDateFilter ? 1 : 0,
                                }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">From</Label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 w-[160px]"
                                            value={dateRange.from}
                                            onChange={(e) =>
                                                setDateRange((prev) => ({ ...prev, from: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">To</Label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 w-[160px]"
                                            value={dateRange.to}
                                            onChange={(e) =>
                                                setDateRange((prev) => ({ ...prev, to: e.target.value }))
                                            }
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

            {/* Recoveries List */}
            {isLoading ? (
                <ListSkeleton />
            ) : (
                <motion.div variants={itemVariants}>
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                <span>All Recoveries ({filteredRecoveries.length})({recoveryResponse?.data?.count})</span>
                                <span>
                                    Page No: {currentPage}/{Math.ceil((recoveryResponse?.data?.count || 0) / 10) || 1}
                                </span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    Total: ₹
                                    {filteredRecoveries
                                        .reduce((acc, rec) => acc + rec.amount, 0)
                                        .toLocaleString()}/₹{recoveryResponse?.data?.totalAmount.toLocaleString()}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Expense Source</TableHead>
                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecoveries.map((recovery) => (
                                        <TableRow key={recovery.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                                                        <Undo2 className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold">{recovery.expense.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 font-medium w-fit border border-indigo-500/20">
                                                                Recovery
                                                            </span>
                                                            {recovery.description && (
                                                                <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={recovery.description}>
                                                                    • {recovery.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {new Date(recovery.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-indigo-500">
                                                +₹{recovery.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {!filteredRecoveries.length && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No recoveries found matching your criteria
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            <div className="flex items-center justify-end gap-2 mr-4">
                <Button variant="outline" onClick={() => handleChangePage("previous")} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleChangePage("next")}
                    disabled={recoveries.length < 10 || currentPage >= Math.ceil((recoveryResponse?.data?.count || 0) / 10)}
                >
                    Next
                </Button>
            </div>
        </motion.div>
    );
};

export default RecoveriesPage;
