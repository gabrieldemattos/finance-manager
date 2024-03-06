-- CreateTable
CREATE TABLE "MonthlyProfit" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyProfit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonthlyProfit" ADD CONSTRAINT "MonthlyProfit_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "Finance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
