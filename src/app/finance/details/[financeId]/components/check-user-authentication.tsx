"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FinanceTable from "./finance-table";
import { Finance, MoneyWithdraw, MonthlyProfit } from "@prisma/client";

interface CheckUserAuthenticationProps {
  finance: Finance;
  monthlyProfits: MonthlyProfit[];
  moneyWithdraw: MoneyWithdraw[];
}

const CheckUserAuthentication = ({
  finance,
  monthlyProfits,
  moneyWithdraw,
}: CheckUserAuthenticationProps) => {
  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [status]);

  return (
    <div>
      {status === "authenticated" && (
        <FinanceTable
          finance={finance}
          monthlyProfits={monthlyProfits}
          moneyWithdraw={moneyWithdraw}
        />
      )}
    </div>
  );
};

export default CheckUserAuthentication;
