import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useUserContext } from "@/context/user.context";
import { useLazyGetTransactionsReportQuery } from "@/services/reports.service";
import { generatePDF } from "@/utils/document";
import type { TransactionsReportType } from "@/utils/types";
import { motion } from "framer-motion";
import { Calendar, Download, FileText, Loader2, Trash } from "lucide-react";
import { useMemo, useState } from "react";

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

const monthIndex = new Date().getMonth()

const yearIndex = new Date().getFullYear()

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ReportsPage = () => {

  const [transactionsReport, setTransactionsReport] = useState<TransactionsReportType[]>([]);

  const [selectedMonth, setSelectedMonth] = useState(monthIndex);
  const [selectedYear, setSelectedYear] = useState(yearIndex);

  const context = useUserContext();

  const user = useMemo(() => context.user, [context.user]);

  const [getTransactionsReport, { isLoading }] = useLazyGetTransactionsReportQuery();

  const handleGenerateReport = async () => {

    const response = await getTransactionsReport({ id: user?.id!, m: selectedMonth.toString(), y: selectedYear.toString() }, true).unwrap();

    if (response.success) {
      setTransactionsReport(response.data || []);
    }
    console.error(response.message);
    console.log(response);
  };

  const downloadPdf = () => {
    generatePDF(transactionsReport);
  };

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
        <Button size="lg" className="gap-2" onClick={handleGenerateReport}>
          <FileText className="w-5 h-5" />
          Generate Report
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex  items-center justify-between gap-4">
            <div className="flex flex-wrap  gap-4 w-full">
              <Select defaultValue="all" onValueChange={(value) => setSelectedMonth(Number(value))}>
                <SelectTrigger className="w-[180px] bg-muted/50">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {
                    Array.from({ length: monthIndex + 1 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {months[monthIndex]}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Select defaultValue={yearIndex.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="w-[140px] bg-muted/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {
                    Array.from({ length: yearIndex - (new Date(user?.createdAt ?? new Date()).getFullYear() ?? 2026) + 1 }, (_, i) => i + (new Date(user?.createdAt ?? new Date()).getFullYear() ?? 2026)).reverse().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 ">
              <Button variant="outline" className="gap-2" onClick={downloadPdf} disabled={transactionsReport.length === 0}>
                <Download className="w-4 h-4" />
                PDF
              </Button>

              <Button variant="destructive" onClick={() => setTransactionsReport([])}>
                <Trash className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Transactions Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <GeneratingLoader />
                      </TableCell>
                    </TableRow>
                  ) : transactionsReport.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactionsReport.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.type === "IN"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                          >
                            {transaction.type === "IN" ? "Inflow" : "Outflow"}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${transaction.type === "IN" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                          }`}>
                          {transaction.type === "IN" ? "+" : "-"} ₹{Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{transaction.currentBalance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};


const GeneratingLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Generating report...
    </div>
  );
};

export default ReportsPage;