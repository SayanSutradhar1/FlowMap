import { motion } from "framer-motion";
import { Download, FileText, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reports = [
  {
    id: 1,
    title: "Monthly Expense Report",
    description: "Complete breakdown of expenses for January 2024",
    date: "2024-01-31",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Quarterly Summary Q4 2023",
    description: "Financial summary for October - December 2023",
    date: "2024-01-15",
    type: "PDF",
    size: "4.1 MB",
  },
  {
    id: 3,
    title: "Annual Report 2023",
    description: "Complete annual financial overview for 2023",
    date: "2024-01-01",
    type: "PDF",
    size: "8.7 MB",
  },
  {
    id: 4,
    title: "Category Analysis Report",
    description: "Detailed analysis by spending categories",
    date: "2024-01-20",
    type: "Excel",
    size: "1.2 MB",
  },
  {
    id: 5,
    title: "Budget vs Actual Report",
    description: "Comparison of budgeted vs actual spending",
    date: "2024-01-25",
    type: "PDF",
    size: "1.8 MB",
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

const ReportsPage = () => {
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
          <h1 className="text-3xl font-display font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download financial reports</p>
        </div>
        <Button size="lg" className="gap-2">
          <FileText className="w-5 h-5" />
          Generate Report
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 w-full">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-muted/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="2024">
                <SelectTrigger className="w-[140px] bg-muted/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Generate */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50 bg-linear-to-r from-primary/10 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Quick Generate</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a report for the current month instantly
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Excel
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">{report.type}</p>
                      <p className="text-xs text-muted-foreground">{report.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReportsPage;