import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from "@/context/user.context";
import { useGetBudgetDetailsQuery, useUpdateBudgetMutation } from "@/services/budget.service";
import type { ExpenseCategory } from "@/utils/types";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Plus, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const budgets: {
  // category: ExpenseCategory;
  color: string;
}[] = [
    { color: "#14b8a6" },
    { color: "#f59e0b" },
    { color: "#8b5cf6" },
    { color: "#3b82f6" },
    { color: "#ef4444" },
    { color: "#10b981" },
    { color: "#6366f1" },
    { color: "#ec4899" },
    { color: "#14b8a6" },
    { color: "#8b5cf6" },
    { color: "#3b82f6" },
    { color: "#ef4444" },
  ];

const categories: ExpenseCategory[] = [
  "EDUCATION",
  "HEALTH",
  "TRAVEL",
  "FOOD",
  "ENTERTAINMENT",
  "BILL",
  "HOUSING",
  "ELECTRONICS",
  "CLOTHING",
  "INVESTS",
  "MISCELLANEOUS",
  "OTHER",
];

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

const BudgetPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [updateBudgetDetails, setUpdateBudgetDetails] = useState<{
    category: ExpenseCategory | null;
    amount: string;
  }>({
    category: null,
    amount: "",
  })

  const context = useUserContext()

  const user = useMemo(() => context?.user, [context])


  const { data: budgetDetailsResponse, isLoading } = useGetBudgetDetailsQuery(user?.id || "")

  const [updateBudget] = useUpdateBudgetMutation()

  const budgetDetails = useMemo(() => budgetDetailsResponse?.data, [budgetDetailsResponse?.data]) ?? []

  const handleUpdateBudget = async () => {

    if (!updateBudgetDetails.category || !updateBudgetDetails.amount) {
      toast.error("Please select a category and amount")
      return
    }

    const toastId = toast.loading("Updating budget...")

    try {
      const response = await updateBudget({ id: user?.id || "", category: updateBudgetDetails.category!, amount: Number(updateBudgetDetails.amount) }).unwrap()

      if (response.success) {
        toast.success("Budget updated successfully")
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsAddDialogOpen(false)
      setUpdateBudgetDetails({
        category: null,
        amount: "",
      })
      toast.dismiss(toastId)
    }
  }

  if (isLoading) {
    return <BudgetPageSkeleton />
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
          <h1 className="text-3xl font-display font-bold">Budget Goals</h1>
          <p className="text-muted-foreground mt-1">Set and track your spending limits</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Create Budget Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={updateBudgetDetails.category ?? ""} onValueChange={(value) => setUpdateBudgetDetails({ ...updateBudgetDetails, category: value as ExpenseCategory })}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Budget (₹)</Label>
                <Input type="number" placeholder="0.00" className="bg-muted/50" value={updateBudgetDetails.amount} onChange={(e) => setUpdateBudgetDetails({ ...updateBudgetDetails, amount: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpdateBudget}>
                  Update Budget
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-xl font-bold">₹{budgetDetails.reduce((acc, b) => acc + (b.budgetAmount || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent to-accent/60 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">₹{budgetDetails.reduce((acc, b) => acc + (b.amount || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-500/60 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-xl font-bold">{budgetDetails.filter((b) => b.amount <= ((b.budgetAmount || 0) * 0.8)).length} budgets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-red-500/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Over Budget</p>
                <p className="text-xl font-bold">{budgetDetails.filter((b) => b.amount > ((b.budgetAmount || 0) * 0.8)).length} budgets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Progress */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Overall Monthly Progress</h3>
                <p className="text-sm text-muted-foreground">
                  ₹{budgetDetails.reduce((acc, b) => acc + (b.amount || 0), 0).toLocaleString()} of ₹{budgetDetails.reduce((acc, b) => acc + (b.budgetAmount || 0), 0).toLocaleString()} spent
                </p>
              </div>
              <span className="text-2xl font-bold">{Math.round((budgetDetails.reduce((acc, b) => acc + (b.amount || 0), 0) / budgetDetails.reduce((acc, b) => acc + (b.budgetAmount || 0), 0)) * 100)}%</span>
            </div>
            <Progress
              value={(budgetDetails.reduce((acc, b) => acc + (b.amount || 0), 0) / budgetDetails.reduce((acc, b) => acc + (b.budgetAmount || 0), 0)) * 100}
              className="h-4 bg-muted/50"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

        {budgetDetails?.map((budget, index) => {
          const percentage = budget.budgetAmount ? (budget.amount / budget.budgetAmount) * 100 : 0;
          const isOverBudget = percentage > 100;
          const isWarning = percentage > 80 && percentage <= 100;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`glass-card border-border/50 hover:border-primary/30 transition-all duration-300 ${isOverBudget ? "border-red-500/50" : isWarning ? "border-amber-500/50" : ""
                  }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budgets[index].color }}
                      />
                      <h3 className="font-semibold">{budget.category}</h3>
                    </div>
                    {isOverBudget && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Over
                      </span>
                    )}
                    {isWarning && (
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-500">
                        Warning
                      </span>
                    )}
                    {!isOverBudget && !isWarning && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        On Track
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">₹{budget.amount}</span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : isWarning ? "[&>div]:bg-amber-500" : ""}`}
                      style={
                        {
                          "--progress-color": budgets[index].color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">₹{budget.budgetAmount ? budget.budgetAmount.toLocaleString() : ""}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {isOverBudget
                        ? `Over by ₹${budget.budgetAmount ? (budget.amount - budget.budgetAmount).toLocaleString() : ""}`
                        : `₹${budget.budgetAmount ? (budget.budgetAmount - budget.amount).toLocaleString() : ""} remaining`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};


const BudgetPageSkeleton = () => {
  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-11 w-36" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress Skeleton */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
        </CardContent>
      </Card>

      {/* Budget Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;