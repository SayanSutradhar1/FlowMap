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
  Car,
  CreditCard,
  Filter,
  GraduationCap,
  Heart,
  Home,
  Music,
  Plus,
  RefreshCcw,
  Search,
  ShoppingBag,
  Smartphone,
  Trash2,
  TrendingDown,
  UtensilsCrossed,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "FOOD": return <UtensilsCrossed className="w-5 h-5 text-orange-500" />;
    case "TRAVEL": return <Car className="w-5 h-5 text-blue-500" />;
    case "ENTERTAINMENT": return <Music className="w-5 h-5 text-purple-500" />;
    case "BILL": return <Zap className="w-5 h-5 text-yellow-500" />;
    case "SHOPPING": return <ShoppingBag className="w-5 h-5 text-pink-500" />;
    case "ELECTRONICS": return <Smartphone className="w-5 h-5 text-gray-500" />;
    case "EDUCATION": return <GraduationCap className="w-5 h-5 text-indigo-500" />;
    case "HEALTH": return <Heart className="w-5 h-5 text-red-500" />;
    case "HOUSING": return <Home className="w-5 h-5 text-teal-500" />;
    case "INVESTS": return <TrendingDown className="w-5 h-5 text-green-500" />;
    default: return <CreditCard className="w-5 h-5 text-muted-foreground" />;
  }
};

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

import CashRecoveryModal from "@/components/Elements/CashRecoveryModal";
import ListSkeleton from "@/components/Layout/Skeletons/ListSkeleton";
import { useUserContext } from "@/context/user.context";
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
  const [currentPage, setCurrentPage] = useState(1)
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false)

  const context = useUserContext()

  const user = useMemo(() => context?.user, [context.user])

  const [addNewExpense] = useAddNewExpenseMutation({
    fixedCacheKey: "Expense",
  })

  const { data: expensesDataResponse, isLoading: initialLoading } = useGetAllExpensesQuery({
    take: 10,
    skip: (currentPage - 1) * 10
  })

  const expenses = useMemo(() => {

    return expensesDataResponse?.data?.expenses || []

  }, [expensesDataResponse?.data?.expenses])

  const handleChangePage = (change: "next" | "previous") => {

    if (change === "next" && expenses.length < 10) return
    if (change === "previous" && currentPage === 1) return

    if (change === "next") {
      setCurrentPage((prev) => prev + 1)
    } else {
      setCurrentPage((prev) => prev - 1)
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        userId: user?.id || "",
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
      {
        initialLoading ? <ListSkeleton /> : (
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  <span>All Expenses ({filteredExpenses.length})/({expensesDataResponse?.data?.count})</span>
                  <span>
                    Page No: {currentPage}/{Math.ceil((expensesDataResponse?.data?.count || 0) / 10)}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Total: ₹{filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0).toLocaleString()}/₹{expensesDataResponse?.data?.total}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Category</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                              {getCategoryIcon(expense.category)}
                            </div>
                            <span className="text-sm font-medium bg-secondary/50 px-2 py-1 rounded-md">
                              {expense.category}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold">{expense.name}</span>
                            <div className="flex items-center gap-2">
                              {expense.description && (
                                <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={expense.description}>
                                  {expense.description}
                                </span>
                              )}
                              {expense.recoverable && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/20">
                                  Reimbursable
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {new Date(expense.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </TableCell>
                        <TableCell className="text-right font-bold text-rose-500">
                          -₹{expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {
                              expense.recoverable && (<>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => setIsRecoverModalOpen(true)}>
                                  <RefreshCcw className="w-4 h-4 text-destructive" />
                                </Button>
                                <CashRecoveryModal
                                  id={user?.id || ""}
                                  expenseId={expense.id || ""}
                                  open={isRecoverModalOpen}
                                  onOpenChange={setIsRecoverModalOpen}
                                />
                              </>
                              )

                            }
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!filteredExpenses.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    No expenses found matching your criteria
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
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





export default ExpensesPage;