"use client";

import { deleteProfit, deleteWithdraw } from "@/actions/delete-profit-withdraw";
import { AccordionContent } from "@/components/ui/accordion";
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
import { formatDateString } from "@/utils/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface AcordionProps {
  id: string;
  data: string;
  profitOrWithdraw: number | string;
  month?: number | string;
  year?: number | string;
  date?: Date;
}

const Acordion = ({
  id,
  data,
  profitOrWithdraw,
  month,
  year,
  date,
}: AcordionProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  //month according to the number
  const months: string[] = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      if (data === "resgate") {
        await deleteWithdraw(id);
        toast.success("Resgate excluído com sucesso!", {
          position: "bottom-center",
        });
        return setIsDeleting(false);
      } else if (data === "rendimento") {
        await deleteProfit(id);
        toast.success("Rendimento excluído com sucesso!", {
          position: "bottom-center",
        });
        return setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Ocorreu um erro, por favor, tente novamente.", {
        position: "bottom-center",
      });
      return setIsDeleting(false);
    }
  };

  return (
    <>
      <AccordionContent className="flex w-full items-center justify-between border-b px-5 py-2">
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger
              disabled={isDeleting}
              data-deleting={isDeleting}
              className="text-red-600 data-[deleting=true]:cursor-not-allowed data-[deleting=true]:text-gray-500"
            >
              <X className="w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja remover esse registro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso excluirá permanentemente
                  o registro.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex flex-col">
            <p className="text-left capitalize">{data}:</p>
            <p
              data-type={data}
              className="font-bold text-red-500 data-[type=rendimento]:text-green-500"
            >
              {profitOrWithdraw}
            </p>
          </div>
        </div>

        {month && year && (
          <>
            <p className="flex flex-col text-center">
              Mês:
              <span className="font-bold">{months[Number(month) - 1]}</span>
            </p>

            <p className="flex flex-col text-right">
              Ano: <span className="font-bold">{year}</span>
            </p>
          </>
        )}

        {date && (
          <p className="flex flex-col text-center">
            Data:
            <span className="font-bold">
              {formatDateString(date.toISOString()).formatedDate}
            </span>
          </p>
        )}
      </AccordionContent>
    </>
  );
};

export default Acordion;
