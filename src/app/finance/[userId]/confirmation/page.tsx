"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { currency, formatCurrency, formatDate } from "@/utils/utils";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const ConfirmationPage = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const { status } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [status]);

  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (status === "unauthenticated") {
      return router.push("/");
    }

    const response = await fetch("/api/finance/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: Buffer.from(
        JSON.stringify({
          userId: params.userId,
          financeName: searchParams.get("financeName")?.toLowerCase().trim(),
          startDate: searchParams.get("startDate"),
          endDate:
            searchParams.get("endDate") === "undefined"
              ? null
              : searchParams.get("endDate"),
          initialInvestment: Number(searchParams.get("initialInvestment")),
          currency: searchParams.get("currency"),
        }),
      ),
    });

    const res = await response.json();

    if (res?.error?.code === "USER_NOT_FOUND") {
      toast.error("Ocorreu um erro ao validar seus dados.", {
        position: "bottom-center",
      });
      return setLoading(false);
    }

    if (res?.error?.code === "DATABASE_ERROR") {
      toast.error("Ocorreu um erro ao conectar-se com o banco.", {
        position: "bottom-center",
      });
      return setLoading(false);
    }

    if (res?.error?.code === "DATE_ERROR") {
      toast.error("A data de vencimento deve ser maior que a data inicial.", {
        position: "bottom-center",
      });
      return setLoading(false);
    }

    if (res?.error?.code === "INVALID_NAME") {
      toast.error("O nome da aplicação deve ter no maximo 15 caracteres.", {
        position: "bottom-center",
      });
      return setLoading(false);
    }

    toast.success("Os dados da sua aplicação foram registrados com sucesso!", {
      position: "bottom-center",
    });
    setLoading(false);
    return router.push("/");
  };

  return (
    <div className="flex h-full flex-col items-center bg-gray-50">
      {status === "authenticated" && (
        <div className="mt-16">
          <h1 className="text-center text-3xl font-bold">
            Confirmação de Dados
          </h1>

          <form
            className="mt-14 flex flex-col gap-7 rounded-md border bg-white px-2 py-6 shadow md:p-10"
            onSubmit={handleSubmit}
          >
            <div className="break-words text-sm md:text-base">
              <p>
                Nome da aplicação:{" "}
                <span className="font-bold uppercase">
                  {searchParams.get("financeName")}
                </span>
              </p>
            </div>

            <div className="text-sm md:text-base">
              <p>
                Data de início da aplicação:{" "}
                <span className="font-bold uppercase">
                  {formatDate(searchParams.get("startDate") as any)}
                </span>
              </p>
            </div>

            <div className="text-sm md:text-base">
              <p>
                Data de vencimento da aplicação:{" "}
                <span className="font-bold uppercase">
                  {searchParams.get("endDate") === "undefined"
                    ? "Sem data de vencimento"
                    : formatDate(searchParams.get("endDate") as any)}
                </span>
              </p>
            </div>

            <div className="text-sm md:text-base">
              <p>
                Valor inicial investido:{" "}
                <span className="font-bold uppercase">
                  {formatCurrency(
                    Number(searchParams.get("initialInvestment")),
                    searchParams.get("currency") as any,
                  )}
                </span>
              </p>
            </div>

            <div className="text-sm md:text-base">
              <p>
                Tipo da moeda investida:{" "}
                <span className="font-bold uppercase">
                  {currency(searchParams.get("currency") as any)}
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Button
                className="w-full uppercase"
                type="submit"
                disabled={loading}
              >
                Confirmar
              </Button>
              <Button
                disabled={loading}
                className="w-full uppercase"
                variant="destructive"
                type="reset"
                onClick={() => router.push("/finance/new")}
              >
                Voltar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;
