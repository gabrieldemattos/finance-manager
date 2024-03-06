import { prismaClient } from "@/lib/prisma";
import FinanceNotFound from "./components/finance-not-found";
import CheckUserAuthentication from "./components/check-user-authentication";

const getFinancesDetails = async (financeId: string) => {
  const finance = await prismaClient.finance.findUnique({
    where: {
      id: financeId,
    },
    include: {
      monthlyProfits: true,
      moneyWithdraw: true,
    },
  });

  return finance;
};

const FinanceDetails = async ({
  params,
}: {
  params: { financeId: string };
}) => {
  const finance = await getFinancesDetails(params.financeId);

  if (!finance) return <FinanceNotFound />;

  return (
    <div className="flex h-full flex-col items-center bg-gray-50">
      <div className="mb-20 mt-20">
        <CheckUserAuthentication
          finance={finance}
          monthlyProfits={finance.monthlyProfits}
          moneyWithdraw={finance.moneyWithdraw}
        />
      </div>
    </div>
  );
};

export default FinanceDetails;
