import { deleteFinance } from "@/actions/delete-finance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  checkApplicationHasExpired,
  formatCurrency,
  formatDateString,
} from "@/utils/utils";
import { Finance } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

interface FinanceCardProps {
  finance: Finance;
  updateFinances: Dispatch<SetStateAction<Finance[]>>;
}

const FinanceCard = ({ finance, updateFinances }: FinanceCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleEditFinance = async (id: string) => {
    setIsLoading(true);
    return router.push(`/finance/details/${id}`);
  };

  const handleRemoveFinance = async (financeId: string) => {
    setIsLoading(true);
    const excludeFinance = await deleteFinance(financeId);

    if (!excludeFinance) {
      setIsLoading(false);
      return toast.error(
        "Ocorreu um erro ao remover os dados, tente novamente!",
        {
          position: "bottom-center",
        },
      );
    }

    toast.success("Aplicação removida com sucesso!", {
      position: "bottom-center",
    });

    setIsLoading(false);
    return updateFinances((prevFinances) =>
      prevFinances.filter((finance) => finance.id !== financeId),
    );
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-3 shadow-lg">
      <h1
        data-expired={checkApplicationHasExpired(finance.endDate)}
        className="mb-2 text-center text-2xl font-bold uppercase italic data-[expired=true]:text-red-500"
      >
        {finance.financeName}
      </h1>

      <p className="flex flex-col lg:block">
        Aplicação inicial:{" "}
        <span className="break-words font-bold uppercase text-green-500">
          {formatCurrency(finance.initialInvestment, finance.currency)}
        </span>
      </p>

      <p className="flex flex-col lg:block">
        Inicío da aplicação:{" "}
        <span className="font-bold">
          {formatDateString(finance.startDate as any).formatedDate}
        </span>
      </p>

      <p className="flex flex-col lg:block">
        Vencimento da aplicação:{" "}
        <span
          data-expired={checkApplicationHasExpired(finance.endDate)}
          className="font-bold data-[expired=null]:text-blue-500 data-[expired=true]:text-red-500"
        >
          {!finance.endDate
            ? "Sem data de vencimento"
            : formatDateString(finance.endDate as any).formatedDate}
        </span>
      </p>

      <Separator />

      <div className="mt-2">
        <Button
          disabled={isLoading}
          variant="default"
          className="flex w-full gap-2"
          onClick={() => handleEditFinance(finance.id)}
        >
          <Pencil className="h-4 w-4" />
          <p className="capitalize">Exibir detalhes</p>
        </Button>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild className="w-full">
          <Button variant="destructive" className="gap-2" disabled={isLoading}>
            <Trash className="h-4 w-4" />
            <p className="capitalize">Remover</p>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja remover este registro?
            </AlertDialogTitle>

            <AlertDialogDescription className="font-medium">
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              registro:{" "}
              <span className="font-bold uppercase text-black">
                {finance.financeName}.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => handleRemoveFinance(finance.id)}
              className="bg-red-500 hover:bg-destructive/90"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinanceCard;
