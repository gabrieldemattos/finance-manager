"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  checkApplicationHasExpired,
  currency,
  formatCurrency,
  formatDate,
} from "@/utils/utils";
import ModalTable from "./modal-table";
import { Finance, MoneyWithdraw, MonthlyProfit } from "@prisma/client";
import Acordion from "./acordion";
import { useRouter } from "next/navigation";
import ChartComponent from "@/components/chart";

interface FinanceTableProps {
  finance: Finance;
  monthlyProfits: MonthlyProfit[];
  moneyWithdraw: MoneyWithdraw[];
}

const FinanceTable = ({
  finance,
  monthlyProfits,
  moneyWithdraw,
}: FinanceTableProps) => {
  const router = useRouter();

  const totalProfit = monthlyProfits?.reduce(
    (acc, curr) => acc + curr.profit,
    0,
  );

  const totalWithdraw = moneyWithdraw.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  //pegar todos os valores profit
  const arrayProfits = monthlyProfits.map((item) => {
    return item.profit;
  });

  //pegar todos os valores withdraw
  const arrayWithdraw = moneyWithdraw.map((item) => {
    return item.amount;
  });

  const backToHome = () => router.push("/");

  return (
    <div className="flex flex-col gap-7 rounded-md border bg-white px-2 py-6 shadow md:p-10">
      {finance && (
        <>
          <div className="text-sm md:text-base">
            <p>
              Nome da aplicação:{" "}
              <span className="font-bold uppercase">{finance.financeName}</span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p>
              Data de início da aplicação:{" "}
              <span className="font-bold uppercase">
                {formatDate(finance.startDate)}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p>
              Data de vencimento da aplicação:{" "}
              <span
                data-expired={checkApplicationHasExpired(finance.endDate)}
                className="font-bold uppercase data-[expired=null]:italic data-[expired=true]:italic data-[expired=null]:text-blue-500 data-[expired=true]:text-red-500"
              >
                {finance.endDate
                  ? formatDate(finance.endDate)
                  : "Sem vencimento"}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p className="">
              Valor inicial investido:{" "}
              <span className="font-bold uppercase text-green-500">
                {formatCurrency(
                  Number(finance.initialInvestment),
                  finance.currency,
                )}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p>
              Tipo da moeda investida:{" "}
              <span className="font-bold uppercase">
                {currency(finance.currency)}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p>
              Registro criado em:{" "}
              <span className="font-bold uppercase">
                {formatDate(finance.createdAt)}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p>
              Última atualização em:{" "}
              <span className="font-bold uppercase">
                {formatDate(finance.updatedAt)}
              </span>
            </p>
          </div>

          <div className="text-sm md:text-base">
            <p className="word-break">
              Total (investido + rendimentos - resgastes):{" "}
              <span className="font-bold uppercase text-green-500">
                {formatCurrency(
                  Number(
                    totalProfit +
                      Number(finance.initialInvestment) -
                      totalWithdraw,
                  ),
                  finance.currency,
                )}
              </span>
            </p>
          </div>

          {/* RENDIMENTOS */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    <p>Rendimentos Registrados</p>
                    <p>
                      Total:{" "}
                      <span className="font-bold text-green-500">
                        {formatCurrency(totalProfit, finance.currency)}
                      </span>
                    </p>
                  </div>
                </AccordionTrigger>
                {monthlyProfits.map((profit) => (
                  <Acordion
                    id={profit.id}
                    key={profit.id}
                    data="rendimento"
                    profitOrWithdraw={formatCurrency(
                      profit.profit,
                      finance.currency,
                    )}
                    month={profit.month}
                    year={profit.year}
                  />
                ))}
              </AccordionItem>
            </Accordion>
          </div>

          {/* RESGATES */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    <p>Resgates Registrados</p>
                    <p>
                      Total:{" "}
                      <span className="font-bold text-red-500">
                        {formatCurrency(totalWithdraw, finance.currency)}
                      </span>
                    </p>
                  </div>
                </AccordionTrigger>
                {moneyWithdraw.map((rescue) => (
                  <Acordion
                    id={rescue.id}
                    key={rescue.id}
                    data="resgate"
                    profitOrWithdraw={formatCurrency(
                      rescue.amount,
                      finance.currency,
                    )}
                    date={rescue.date}
                  />
                ))}
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-5">
            <ChartComponent
              moneyWithdraw={arrayWithdraw.slice(-6)}
              monthlyProfits={arrayProfits.slice(-6)}
            />
          </div>

          <div className="flex flex-col gap-4">
            {/* RENDIMENTO */}
            <ModalTable
              action="profit"
              financeId={finance.id}
              initialDate={finance.startDate}
              endDate={finance.endDate}
              textBtn="registrar rendimento"
              modalTitle="Registro de Rendimento"
              descriptionModal="Preencha os dados abaixo e registre o rendimento."
              labelRegister="Rendimento"
              labelBtnModal="Rendimento"
            />

            {/* RESGATE */}
            <ModalTable
              action="withdraw"
              financeId={finance.id}
              initialDate={finance.startDate}
              endDate={finance.endDate}
              textBtn="registrar resgate"
              modalTitle="Registro de Resgate"
              descriptionModal="Forneça as informações abaixo para registrar o resgate efetuado."
              labelRegister="Resgate"
              labelBtnModal="Resgate"
              totalMoney={Number(
                totalProfit + Number(finance.initialInvestment) - totalWithdraw,
              )}
              currency={finance.currency}
            />

            <Button
              className="w-full uppercase"
              variant="destructive"
              type="reset"
              onClick={backToHome}
            >
              Voltar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceTable;
