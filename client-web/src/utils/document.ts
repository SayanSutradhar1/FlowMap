import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { TransactionsReportType } from "./types";

export const generatePDF = (transactionsReport: TransactionsReportType[]) => {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(18);
  doc.text("Transaction Report", 14, 22);

  // Add Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Define table columns
  const tableColumn = [
    "Date",
    "Description",
    "Type",
    "Cash In",
    "Cash Out",
    "Balance"
  ];

  // Define table rows
  const tableRows = transactionsReport.map((transaction) => {
    const transactionData = [
      new Date(transaction.date).toLocaleDateString(),
      transaction.description,
      transaction.type,
      transaction.cashIn > 0 ? transaction.cashIn.toFixed(2) : "-",
      transaction.cashOut > 0 ? transaction.cashOut.toFixed(2) : "-",
      transaction.currentBalance.toFixed(2),
    ];
    return transactionData;
  });

  // Generate table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129] }, // Emerald color to match theme
    styles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [240, 253, 244] }, // Light emerald
  });

  // Save the PDF
  doc.save("Transaction_Report.pdf");
};
