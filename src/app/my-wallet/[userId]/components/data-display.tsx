import { formatCurrency, currency } from "@/utils/utils";
import { calculateTotal, findMaxByProperty } from "../helpers/find-max";
import { IFilteredFinanceData } from "@/interfaces/IFilteredFinanceData";
import { Separator } from "@/components/ui/separator";

interface DataDisplayProps {
  monthlyProfits: number[];
  moneyWithdraws: number[];
  allInvestments: number[];
  filteredFinances: IFilteredFinanceData[];
  currentCurrency: string;
}

const DataDisplay = ({
  monthlyProfits,
  moneyWithdraws,
  allInvestments,
  filteredFinances,
  currentCurrency,
}: DataDisplayProps) => {
  const totalProfit =
    monthlyProfits.length > 0 ? calculateTotal(monthlyProfits) : 0;

  const totalWithdraw =
    moneyWithdraws.length > 0 ? calculateTotal(moneyWithdraws) : 0;

  const totalInvestments =
    allInvestments.length > 0
      ? allInvestments?.reduce((acc, curr) => acc + curr)
      : 0;

  const totalAmount = totalInvestments + totalProfit - totalWithdraw;

  const applicationWithMoreWithdrawal =
    moneyWithdraws.length > 0
      ? findMaxByProperty(filteredFinances, "moneyWithdraw")
      : null;

  const applicationWithMoreProfit =
    monthlyProfits.length > 0
      ? findMaxByProperty(filteredFinances, "monthlyProfits")
      : null;

  return (
    <div className="flex flex-col gap-5 rounded-lg border p-5 pb-10 shadow-lg">
      <p
        data-currency={currentCurrency}
        className="mb-5 text-center text-2xl font-bold uppercase data-[currency=BRL]:text-green-500 data-[currency=EUR]:text-yellow-500 data-[currency=USD]:text-blue-500"
      >
        {currency(currentCurrency)}
      </p>

      <div className="flex items-center gap-1">
        <p className="whitespace-normal">
          Total investido:{" "}
          <span className="break-all font-bold">
            {formatCurrency(totalInvestments, currentCurrency)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <p className="whitespace-normal">
          Total de Lucros:{" "}
          <span className="break-all font-bold text-green-500">
            {formatCurrency(totalProfit, currentCurrency)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <p className="whitespace-normal">
          Total de Resgates:{" "}
          <span className="break-all font-bold text-red-500">
            {formatCurrency(totalWithdraw, currentCurrency)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <p>
          Aplicação com maior lucro:{" "}
          <span
            data-profit={applicationWithMoreProfit ? "true" : "false"}
            className="font-bold uppercase text-green-500 data-[profit=false]:text-black"
          >
            {applicationWithMoreProfit && (
              <>
                {applicationWithMoreProfit.financeName} (
                {formatCurrency(
                  applicationWithMoreProfit.monthlyProfits,
                  currentCurrency,
                )}
                )
              </>
            )}

            {!applicationWithMoreProfit && "-"}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <p>
          Aplicação com maior resgate:{" "}
          <span
            data-withdraw={applicationWithMoreWithdrawal ? "true" : "false"}
            className="font-bold uppercase text-red-500 data-[withdraw=false]:text-black"
          >
            {applicationWithMoreWithdrawal && (
              <>
                {applicationWithMoreWithdrawal.financeName} (
                {formatCurrency(
                  applicationWithMoreWithdrawal.moneyWithdraw,
                  currentCurrency,
                )}
                )
              </>
            )}

            {!applicationWithMoreWithdrawal && "-"}
          </span>
        </p>
      </div>

      <Separator />

      <div className="flex items-center gap-1">
        <p className="whitespace-normal ">
          Total de Ativos:{" "}
          <span className="break-all font-bold">
            {formatCurrency(totalAmount, currentCurrency)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DataDisplay;
