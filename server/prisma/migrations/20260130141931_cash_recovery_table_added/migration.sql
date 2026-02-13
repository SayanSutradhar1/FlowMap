-- CreateTable
CREATE TABLE "CashRecovery" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashRecovery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashRecovery" ADD CONSTRAINT "CashRecovery_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
