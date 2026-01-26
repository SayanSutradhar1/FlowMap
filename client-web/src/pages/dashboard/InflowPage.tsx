
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/user.context";
import {
    useAddNewInflowMutation,
    useGetAllInflowsQuery,
} from "@/services/cash.service";
import { motion } from "framer-motion";
import {
    Calendar,
    Edit,
    Plus,
    Search,
    Trash2,
    TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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

const InflowPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: "",
        to: "",
    });

    const { user } = useUserContext();

    const [addNewInflow] = useAddNewInflowMutation();

    const { data: inflowsData } = useGetAllInflowsQuery(user?.id || "", {
        skip: !user?.id,
    });

    const inflows = useMemo(() => inflowsData?.data || [], [inflowsData]);

    const filteredInflows = useMemo(() => {
        return inflows.filter((inflow) => {
            const matchesSearch =
                inflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false;

            let matchesDate = true;
            if (dateRange.from) {
                matchesDate =
                    matchesDate && new Date(inflow.createdAt) >= new Date(dateRange.from);
            }
            if (dateRange.to) {
                const endDate = new Date(dateRange.to);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(inflow.createdAt) <= endDate;
            }

            return matchesSearch && matchesDate;
        });
    }, [inflows, searchTerm, dateRange]);

    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");

    const handleAddInflow = async () => {
        if (!amount || !description) {
            toast.error("Please fill all the fields");
            return;
        }

        if (!user?.id) {
            toast.error("User not found");
            return;
        }

        const toastId = toast.loading("Adding inflow...");

        try {
            const response = await addNewInflow({
                userId: user.id,
                amount: amount,
                description: description,
            }).unwrap();

            if (response.success) {
                toast.success(response.message || "Inflow added successfully");
            } else {
                toast.error(response.message || "Something went wrong");
            }
        } catch (error) {
            toast.error((error as Error).message || "Something went wrong");
        } finally {
            setIsAddDialogOpen(false);
            setAmount(0);
            setDescription("");
            toast.dismiss(toastId);
        }
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
                    <h1 className="text-3xl font-display font-bold">Inflow</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your income sources
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Add Inflow
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-display">
                                Add New Inflow
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="bg-muted/50"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    placeholder="Add a description..."
                                    className="bg-muted/50"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button className="flex-1" onClick={handleAddInflow}>
                                    Add Inflow
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
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
                                        placeholder="Search inflows..."
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

            {/* Inflows List */}
            <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span>All Inflows ({filteredInflows.length})</span>
                            <span className="text-sm font-normal text-muted-foreground">
                                Total: ₹
                                {filteredInflows
                                    .reduce((acc, inf) => acc + inf.amount, 0)
                                    .toLocaleString()}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredInflows.map((inflow, index) => {
                                return (
                                    <motion.div
                                        key={inflow.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:bg-accent/5 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center`}
                                            >
                                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {inflow.description || "Inflow"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                                                        Income
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-base text-emerald-500">
                                                    +₹{inflow.amount.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {new Date(inflow.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-background/80"
                                                >
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default InflowPage;
