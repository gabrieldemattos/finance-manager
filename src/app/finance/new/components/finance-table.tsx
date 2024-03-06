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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checkApplicationHasExpired,
  formatCurrency,
  formatDateString,
} from "@/utils/utils";
import { Finance } from "@prisma/client";
import { Calendar, CircleDollarSign, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useMemo } from "react";
import { toast } from "react-toastify";

interface FinanceTableProps {
  finances: Finance[];
  updateFinances: Dispatch<SetStateAction<Finance[]>>;
  filter: string;
}

const FinanceTable = ({
  finances,
  updateFinances,
  filter = "empty",
}: FinanceTableProps) => {
  const router = useRouter();
  const handleEditFinance = async (id: string) => {
    return router.push(`/finance/details/${id}`);
  };

  const handleRemoveFinance = async (financeId: string) => {
    const excludeFinance = await deleteFinance(financeId);

    if (!excludeFinance) {
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

    return updateFinances((prevFinances) =>
      prevFinances.filter((finance) => finance.id !== financeId),
    );
  };

  const checkFilter = useMemo(() => {
    switch (filter) {
      case "recently-created":
        return finances.toSorted(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "old-to-new":
        return finances.toSorted(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "no-end-date":
        return finances.filter((finance) => !finance.endDate);
      case "expiration-date-ascending":
        return finances
          .filter((finance) => finance.endDate)
          .toSorted(
            (a, b) =>
              new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime(),
          );
      case "expiration-date-descending":
        return finances
          .filter((finance) => finance.endDate !== null)
          .toSorted(
            (a, b) =>
              new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime(),
          );
      case "initial-investment-ascending":
        return finances.toSorted(
          (a, b) => a.initialInvestment - b.initialInvestment,
        );
      case "initial-investment-descending":
        return finances.toSorted(
          (a, b) => b.initialInvestment - a.initialInvestment,
        );
      case "currency-euro":
        return finances.filter((finance) => finance.currency === "EUR");
      case "currency-real":
        return finances.filter((finance) => finance.currency === "BRL");
      case "currency-dollar":
        return finances.filter((finance) => finance.currency === "USD");
      case "expired":
        return finances.filter(
          (finance) =>
            checkApplicationHasExpired(finance.endDate!) && finance.endDate,
        );
      default:
        return finances;
    }
  }, [finances, filter]);

  return (
    <Table className="rounded-xl bg-white">
      <TableHeader>
        <TableRow className="hover:bg-inherit">
          <TableHead className="border-r text-center font-semibold text-black text-opacity-60">
            Nome da aplicação
          </TableHead>
          <TableHead className="border-r text-center font-semibold text-black text-opacity-60">
            Aplicação inicial
          </TableHead>
          <TableHead className="border-r text-center font-semibold text-black text-opacity-60 2md:hidden">
            Início da aplicação
          </TableHead>
          <TableHead className="border-r text-center font-semibold text-black text-opacity-60 2md:hidden">
            Vencimento da aplicação
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checkFilter?.length > 0 &&
          checkFilter.map((finance) => (
            <TableRow key={finance.id} className="hover:bg-gray-100">
              <TableCell className="border-r text-center font-bold uppercase">
                {finance.financeName}
              </TableCell>
              <TableCell className="border-r text-center font-bold">
                <p className="flex items-center justify-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-gray-400" />
                  {formatCurrency(finance.initialInvestment, finance.currency)}
                </p>
              </TableCell>
              <TableCell className="border-r text-center font-bold 2md:hidden">
                <p className="hidden items-center justify-center gap-2 2xl:flex">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDateString(finance.startDate as any).formatedDate}
                </p>

                <p className="flex items-center justify-center gap-2 2xl:hidden">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDateString(finance.startDate as any).shortFormatedDate}
                </p>
              </TableCell>
              <TableCell className="border-r text-center font-bold 2md:hidden">
                <p
                  data-expired={checkApplicationHasExpired(finance.endDate)}
                  className="hidden items-center justify-center gap-2 data-[expired=null]:text-blue-500 data-[expired=true]:text-red-500 2xl:flex"
                >
                  {finance.endDate && (
                    <Calendar className="h-4 w-4 text-gray-400" />
                  )}
                  {!finance.endDate
                    ? "Sem data de vencimento"
                    : formatDateString(finance.endDate as any).formatedDate}
                </p>

                <p
                  data-expired={checkApplicationHasExpired(finance.endDate)}
                  className="flex items-center justify-center gap-2 data-[expired=null]:text-blue-500 data-[expired=true]:text-red-500 2xl:hidden"
                >
                  {finance.endDate && (
                    <Calendar className="h-4 w-4 text-gray-400" />
                  )}
                  {!finance.endDate
                    ? "Sem data de vencimento"
                    : formatDateString(finance.endDate as any)
                        .shortFormatedDate}
                </p>
              </TableCell>

              <TableCell className="flex items-center justify-center gap-3 border-r text-center 2md:flex-col">
                <Button
                  variant="default"
                  className="flex w-full gap-2"
                  onClick={() => handleEditFinance(finance.id)}
                >
                  <Pencil className="h-4 w-4" />
                  <p className="capitalize">Exibir detalhes</p>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild className="w-full">
                    <Button variant="destructive" className="gap-2">
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
                        Essa ação não pode ser desfeita. Isso excluirá
                        permanentemente o registro:{" "}
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
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default FinanceTable;
