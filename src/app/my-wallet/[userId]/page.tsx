import { prismaClient } from "@/lib/prisma";
import DataDisplay from "./components/data-display";
import Title from "@/components/title";

const getFinances = async (userId: string, currency: string) => {
  const finances = await prismaClient.finance.findMany({
    where: {
      userId,
      currency,
    },
    select: {
      initialInvestment: true,
      monthlyProfits: {
        select: {
          profit: true,
        },
      },
      moneyWithdraw: {
        select: {
          amount: true,
        },
      },
    },
  });

  const allInvestments = finances.map((finance) => finance.initialInvestment);

  const monthlyProfits = finances.flatMap((finance) =>
    finance.monthlyProfits.map((mp) => mp.profit),
  );

  const moneyWithdraws = finances.flatMap((finance) =>
    finance.moneyWithdraw.map((mw) => mw.amount),
  );

  return { monthlyProfits, moneyWithdraws, allInvestments };
};

const getFilteredFinances = async (userId: string, currency: string) => {
  const finances = await prismaClient.finance.findMany({
    where: {
      userId,
      currency,
    },
    select: {
      financeName: true,
      initialInvestment: true,
      monthlyProfits: {
        select: {
          profit: true,
        },
      },
      moneyWithdraw: {
        select: {
          amount: true,
        },
      },
    },
  });

  const filteredDatas = finances.map(
    ({ initialInvestment, financeName, monthlyProfits, moneyWithdraw }) => ({
      initialInvestment,
      financeName,
      monthlyProfits: monthlyProfits.reduce(
        (acc, curr) => acc + curr.profit,
        0,
      ),
      moneyWithdraw: moneyWithdraw.reduce((acc, curr) => acc + curr.amount, 0),
    }),
  );

  return filteredDatas;
};

const MyWallet = async ({ params }: { params: { userId: string } }) => {
  const currencies = ["BRL", "USD", "EUR"];

  const dataDisplayComponents = await Promise.all(
    currencies.map(async (currency) => {
      const finances = await getFinances(params.userId, currency);
      const filteredFinances = await getFilteredFinances(
        params.userId,
        currency,
      );

      if (!finances || !filteredFinances) return null;

      return (
        <DataDisplay
          key={currency}
          monthlyProfits={finances.monthlyProfits}
          moneyWithdraws={finances.moneyWithdraws}
          allInvestments={finances.allInvestments}
          filteredFinances={filteredFinances}
          currentCurrency={currency}
        />
      );
    }),
  );

  if (dataDisplayComponents.some((component) => component === null))
    return null;

  return (
    <div className="px-3 pt-16 md:px-6">
      <Title
        title="Sua carteira!"
        description="Aqui, você pode acompanhar todos os seus lucros, resgates, total investido, a aplicação com o maior rendimento e aquela que teve o maior resgate, tudo em um único lugar."
      />

      <div className="my-10 flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {dataDisplayComponents}
      </div>
    </div>
  );
};

export default MyWallet;
