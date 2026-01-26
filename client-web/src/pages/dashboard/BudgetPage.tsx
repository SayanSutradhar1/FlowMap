import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Plus, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

const budgets = [
  { id: 1, category: "Food & Dining", budget: 15000, spent: 12500, color: "#14b8a6" },
  { id: 2, category: "Transportation", budget: 8000, spent: 7200, color: "#f59e0b" },
  { id: 3, category: "Shopping", budget: 10000, spent: 12500, color: "#8b5cf6" },
  { id: 4, category: "Entertainment", budget: 5000, spent: 3200, color: "#3b82f6" },
  { id: 5, category: "Bills & Utilities", budget: 12000, spent: 9800, color: "#ef4444" },
  { id: 6, category: "Healthcare", budget: 5000, spent: 1500, color: "#10b981" },
];

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Others",
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

  const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.budget).length;
  const onTrackCount = budgets.filter((b) => b.spent <= b.budget * 0.8).length;

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
                <Select>
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
                <Input type="number" placeholder="0.00" className="bg-muted/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Create Budget
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
                <p className="text-xl font-bold">₹{totalBudget.toLocaleString()}</p>
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
                <p className="text-xl font-bold">₹{totalSpent.toLocaleString()}</p>
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
                <p className="text-xl font-bold">{onTrackCount} budgets</p>
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
                <p className="text-xl font-bold">{overBudgetCount} budgets</p>
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
                  ₹{totalSpent.toLocaleString()} of ₹{totalBudget.toLocaleString()} spent
                </p>
              </div>
              <span className="text-2xl font-bold">{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <Progress
              value={(totalSpent / totalBudget) * 100}
              className="h-4 bg-muted/50"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const isOverBudget = percentage > 100;
          const isWarning = percentage > 80 && percentage <= 100;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`glass-card border-border/50 hover:border-primary/30 transition-all duration-300 ${
                  isOverBudget ? "border-red-500/50" : isWarning ? "border-amber-500/50" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.color }}
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
                      <span className="font-medium">₹{budget.spent.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : isWarning ? "[&>div]:bg-amber-500" : ""}`}
                      style={
                        {
                          "--progress-color": budget.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">₹{budget.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {isOverBudget
                        ? `Over by ₹${(budget.spent - budget.budget).toLocaleString()}`
                        : `₹${(budget.budget - budget.spent).toLocaleString()} remaining`}
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

export default BudgetPage;