import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Bell,
  Calendar,
  Clock,
  Repeat,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

const reminders = [
  {
    id: 1,
    title: "Electricity Bill",
    amount: 2500,
    dueDate: "2024-01-25",
    frequency: "Monthly",
    isActive: true,
    isPaid: false,
  },
  {
    id: 2,
    title: "Internet Bill",
    amount: 999,
    dueDate: "2024-01-20",
    frequency: "Monthly",
    isActive: true,
    isPaid: true,
  },
  {
    id: 3,
    title: "Rent Payment",
    amount: 25000,
    dueDate: "2024-02-01",
    frequency: "Monthly",
    isActive: true,
    isPaid: false,
  },
  {
    id: 4,
    title: "Netflix Subscription",
    amount: 649,
    dueDate: "2024-01-28",
    frequency: "Monthly",
    isActive: true,
    isPaid: false,
  },
  {
    id: 5,
    title: "Gym Membership",
    amount: 2000,
    dueDate: "2024-01-15",
    frequency: "Monthly",
    isActive: false,
    isPaid: true,
  },
  {
    id: 6,
    title: "Car Insurance",
    amount: 15000,
    dueDate: "2024-03-15",
    frequency: "Yearly",
    isActive: true,
    isPaid: false,
  },
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

const RemindersPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const upcomingReminders = reminders.filter((r) => !r.isPaid && r.isActive);
  const totalUpcoming = upcomingReminders.reduce((acc, r) => acc + r.amount, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full overflow-x-hidden"
    >
      {/* Development Warning */}
      <motion.div
        variants={itemVariants}
        className="glass-card border-amber-500/20 bg-amber-500/10 p-4 rounded-xl flex items-center gap-3 text-amber-600 dark:text-amber-500"
      >
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="font-medium">
          This page is under development and it is just a demo design to show.
        </p>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Reminders</h1>
          <p className="text-muted-foreground mt-1">Never miss a payment with smart reminders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">Create Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="e.g., Electricity Bill" className="bg-muted/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" placeholder="0.00" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" className="bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One Time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
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
                  Create Reminder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Payments</p>
                <p className="text-xl font-bold">{upcomingReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent to-accent/60 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="text-xl font-bold">₹{totalUpcoming.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Paid This Month</p>
                <p className="text-xl font-bold">{reminders.filter((r) => r.isPaid).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reminders List */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder, index) => {
                const dueDate = new Date(reminder.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil(
                  (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isOverdue = daysUntilDue < 0 && !reminder.isPaid;
                const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && !reminder.isPaid;

                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${reminder.isPaid
                        ? "bg-emerald-500/10 border border-emerald-500/20"
                        : isOverdue
                          ? "bg-red-500/10 border border-red-500/20"
                          : isDueSoon
                            ? "bg-amber-500/10 border border-amber-500/20"
                            : "bg-muted/30 hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${reminder.isPaid
                            ? "bg-emerald-500/20"
                            : isOverdue
                              ? "bg-red-500/20"
                              : isDueSoon
                                ? "bg-amber-500/20"
                                : "bg-primary/20"
                          }`}
                      >
                        {reminder.isPaid ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : isOverdue ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Bell className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {reminder.dueDate}
                          </span>
                          <span className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Repeat className="w-3 h-3" />
                            {reminder.frequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="font-semibold">₹{reminder.amount.toLocaleString()}</p>
                        <p
                          className={`text-xs ${reminder.isPaid
                              ? "text-emerald-500"
                              : isOverdue
                                ? "text-red-500"
                                : isDueSoon
                                  ? "text-amber-500"
                                  : "text-muted-foreground"
                            }`}
                        >
                          {reminder.isPaid
                            ? "Paid"
                            : isOverdue
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : daysUntilDue === 0
                                ? "Due today"
                                : `Due in ${daysUntilDue} days`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch checked={reminder.isActive} />
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
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

export default RemindersPage;