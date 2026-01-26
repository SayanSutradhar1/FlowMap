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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
  CreditCard,
  Edit,
  Filter,
  GraduationCap,
  Heart,
  Home,
  Music,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  Trash2,
  TrendingDown,
  UtensilsCrossed,
  Zap
} from "lucide-react";
import { useState } from "react";

const categories = [
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

import { useAddNewExpenseMutation, useGetAllExpensesQuery } from "@/services/expense.service";
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

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const [addNewExpense] = useAddNewExpenseMutation({
    fixedCacheKey: "Expense",
  })

  const { data: expensesData } = useGetAllExpensesQuery()

  const expenses = expensesData?.data || []

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;

    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = matchesDate && new Date(expense.createdAt) >= new Date(dateRange.from);
    }
    if (dateRange.to) {
      // Add one day to include the end date fully (or just ensure comparison logic fits usage)
      // Standard approach: To end of the day or just strict date comparison if times are at 00:00
      // Assuming naive string comparison for dates or simple objects:
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(expense.createdAt) <= endDate;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const [name, setName] = useState("")
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [recoverable, setRecoverable] = useState(false)

  const handleAddExpense = async () => {

    if (!name || !amount || !category || !description) {
      toast.error("Please fill all the fields")
      return
    }

    const toastId = toast.loading("Adding expense...")

    try {
      const response = await addNewExpense({
        // TODO: Replace hardcoded userId with actual user context
        name: name,
        userId: "92d8916f-1e2e-449c-a379-6fcc0f78aef0",
        amount: amount,
        category: category,
        description: description,
        recoverable: recoverable,
      }).unwrap()

      if (response.success) {
        toast.success(response.message || "Expense added successfully")

      } else {
        toast.error(response.message || "Something went wrong")
      }

    } catch (error) {
      toast.error((error as Error).message || "Something went wrong")
    } finally {
      setIsAddDialogOpen(false)
      setName("")
      setAmount(0)
      setCategory("")
      setDescription("")
      setRecoverable(false)
      toast.dismiss(toastId)
    }
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
          <h1 className="text-3xl font-display font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and manage your daily expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2" >
              <Plus className="w-5 h-5" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="e.g., Grocery shopping" className="bg-muted/50" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="text" placeholder="0.00" className="bg-muted/50" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
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
                <Label>Description</Label>
                <Input placeholder="Add a description..." className="bg-muted/50" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Switch id="recoverable" checked={recoverable} onCheckedChange={setRecoverable} />
                <Label htmlFor="recoverable" className="font-normal">Recoverable (Reimbursable)</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddExpense}>
                  Add Expense
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
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px] bg-muted/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
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

      {/* Expenses List */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <span>All Expenses ({filteredExpenses.length})</span>
              <span className="text-sm font-normal text-muted-foreground">
                Total: ₹{filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0).toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.map((expense, index) => {
                const getCategoryIcon = (category: string) => {
                  switch (category) {
                    case "FOOD": return <UtensilsCrossed className="w-5 h-5 text-orange-500" />;
                    case "TRAVEL": return <Car className="w-5 h-5 text-blue-500" />;
                    case "ENTERTAINMENT": return <Music className="w-5 h-5 text-purple-500" />;
                    case "BILL": return <Zap className="w-5 h-5 text-yellow-500" />;
                    case "SHOPPING": return <ShoppingBag className="w-5 h-5 text-pink-500" />; // Assuming 'SHOPPING' might be added later, keeping strict to current list
                    case "ELECTRONICS": return <Smartphone className="w-5 h-5 text-gray-500" />;
                    case "EDUCATION": return <GraduationCap className="w-5 h-5 text-indigo-500" />;
                    case "HEALTH": return <Heart className="w-5 h-5 text-red-500" />;
                    case "HOUSING": return <Home className="w-5 h-5 text-teal-500" />;
                    case "INVESTS": return <TrendingDown className="w-5 h-5 text-green-500" />;
                    default: return <CreditCard className="w-5 h-5 text-muted-foreground" />;
                  }
                };

                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:bg-accent/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{expense.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                            {expense.category}
                          </span>
                          {expense.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[150px] sm:max-w-xs" title={expense.description}>
                              {expense.description}
                            </span>
                          )}
                          {expense.recoverable && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                              Reimbursable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-base text-rose-500">
                          -₹{expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {new Date(expense.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10">
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

export default ExpensesPage;