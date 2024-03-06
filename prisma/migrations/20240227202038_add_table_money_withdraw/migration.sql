-- CreateTable
CREATE TABLE "MoneyWithdraw" (
    "id" TEXT NOT NULL,
    "financeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoneyWithdraw_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoneyWithdraw" ADD CONSTRAINT "MoneyWithdraw_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES "Finance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
