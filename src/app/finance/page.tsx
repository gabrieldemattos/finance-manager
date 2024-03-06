"use client";

import { Button } from "@/components/ui/button";
import { Finance } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FinanceTable from "./new/components/finance-table";
import Loading from "../loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FinancePage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("empty");

  useEffect(() => {
    setIsLoading(true);
    const fetchFinances = async () => {
      const response = await fetch(
        `http://localhost:3000/api/user/${(data?.user as any)?.id}/finances`,
      );

      const json = await response.json();

      const userFinances = json?.finances;

      setFinances(userFinances);
      setIsLoading(false);
    };

    if (status === "unauthenticated") {
      setIsLoading(false);
      return router.push("/");
    }

    if (status === "authenticated") {
      fetchFinances();
      return;
    }
  }, [status]);

  const handleCreateFinance = () => {
    router.push("/finance/new");
  };

  const filteredFinanceSearch = search.length
    ? finances?.filter((finance) => finance.financeName.includes(search))
    : finances;

  return (
    <div className="flex h-full flex-col items-center bg-gray-50 p-2 pt-16 xl:p-16">
      {!isLoading && data && (
        <>
          <div className="flex flex-col items-center gap-2 px-5">
            <p className="text-2xl font-bold">
              Olá, {data?.user?.name?.split(" ")[0]}!
            </p>
            <p className="text-center text-lg text-gray-500 text-opacity-80">
              Bem-vindo ao seu painel financeiro personalizado. Aqui você pode
              acompanhar suas finanças de forma fácil e intuitiva.
            </p>
          </div>

          {!finances?.length && (
            <div className="mt-20 w-full">
              <div className="flex flex-col items-center gap-5">
                <h1 className="text-center text-lg text-red-500">
                  Ainda sem registros. Que tal criar um agora?
                </h1>
              </div>
            </div>
          )}

          <Button onClick={handleCreateFinance} className="mt-2 w-fit">
            Criar Novo Registro
          </Button>

          <div className="mt-10 w-full px-0 md:px-0 lg:px-10 xl:px-2 2xl:px-36">
            {finances?.length > 0 && (
              <div className="flex h-[30.3125rem] flex-col md:h-[34.375rem]">
                <div className="mb-5 flex flex-col gap-3 px-5 sm:flex-row sm:justify-between sm:px-2">
                  <div className="flex items-center gap-1 sm:order-1 sm:w-auto">
                    <p className="font-medium">Filtrar por:</p>
                    <Select onValueChange={(value) => setFilter(value)}>
                      <SelectTrigger className="w-[180px] text-left">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="recently-created">
                            Mais recentes primeiro
                          </SelectItem>
                          <SelectItem value="old-to-new">
                            Mais antigas primeiro
                          </SelectItem>
                          <SelectItem value="no-end-date">
                            Sem data de vencimento
                          </SelectItem>
                          <SelectItem value="expiration-date-ascending">
                            Ordem de vencimento crescente
                          </SelectItem>
                          <SelectItem value="expiration-date-descending">
                            Ordem de vencimento decrescente
                          </SelectItem>
                          <SelectItem value="initial-investment-ascending">
                            Ordem de aplicação inicial crescente
                          </SelectItem>
                          <SelectItem value="initial-investment-descending">
                            Ordem de aplicação inicial decrescente
                          </SelectItem>
                          <SelectItem value="currency-euro">Euro</SelectItem>
                          <SelectItem value="currency-real">Real</SelectItem>
                          <SelectItem value="currency-dollar">Dólar</SelectItem>
                          <SelectItem value="expired">Já vencidas</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative flex w-full items-center sm:w-auto">
                    <input
                      type="text"
                      placeholder="Buscar aplicação.."
                      className="h-full w-full rounded border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute flex h-full items-center border-r bg-gray-100 px-2">
                      <Search size={20} />
                    </span>
                  </div>
                </div>

                <FinanceTable
                  finances={filteredFinanceSearch}
                  updateFinances={setFinances}
                  filter={filter}
                />
              </div>
            )}
          </div>
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default FinancePage;
