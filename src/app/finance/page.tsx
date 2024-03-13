"use client";

import { Button } from "@/components/ui/button";
import { Finance } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FinanceCard from "./components/finance-card";
import Loading from "../loading";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { checkFilter, filters } from "./helpers/finance-filter";
import Title from "@/components/title";

const FinancePage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("empty");

  useEffect(() => {
    setIsLoading(true);
    const fetchFinances = async () => {
      const response = await fetch(
        `/api/user/${(data?.user as any)?.id}/finances`,
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
          <Title
            title={`Olá, ${data?.user?.name?.split(" ")[0]}!`}
            description="Bem-vindo ao seu painel financeiro personalizado. Aqui você pode acompanhar suas finanças de forma fácil e intuitiva."
          />

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

          {finances?.length > 0 && (
            <div className="my-16 w-full px-1">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Sheet>
                  <SheetTrigger className="flex items-center gap-1 sm:order-1">
                    Filtrar Por <Filter />
                  </SheetTrigger>

                  <SheetContent side="left">
                    <SheetHeader className="text-left text-lg font-semibold capitalize">
                      Filtros
                    </SheetHeader>

                    <div className="mb-5 mt-2">
                      <Separator />
                    </div>

                    <div className="mb-10 flex flex-col gap-4">
                      {filters.map((filter) => (
                        <SheetClose asChild key={filter.value}>
                          <label
                            data-value={selectedFilter === filter.value}
                            className="flex cursor-pointer items-center gap-2 capitalize hover:underline data-[value=true]:font-bold"
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={selectedFilter === filter.value}
                              onClick={() => setSelectedFilter(filter.value)}
                            />
                            {filter.label}
                          </label>
                        </SheetClose>
                      ))}
                    </div>

                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          onClick={() => setSelectedFilter("")}
                          className="w-full"
                        >
                          Limpar Filtro
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <div className="relative flex w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar aplicação.."
                    className="h-full w-full rounded border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none"
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    value={search}
                  />
                  <span className="absolute flex h-full items-center border-r bg-gray-100 px-2">
                    <Search size={20} />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 2xl:grid-cols-3">
                {checkFilter(filteredFinanceSearch, selectedFilter).map(
                  (finance) => (
                    <FinanceCard
                      key={finance.id}
                      updateFinances={setFinances}
                      finance={finance}
                    />
                  ),
                )}
              </div>
            </div>
          )}
        </>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default FinancePage;
