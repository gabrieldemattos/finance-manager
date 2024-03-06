"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { createNewProfit } from "@/actions/create-new-profit";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/utils";
import { createNewWithdraw } from "@/actions/create-new-withdraw";

interface ModalTableProps {
  action: string; //withdraw or profit
  financeId: string;
  initialDate: Date;
  endDate: Date | null;
  textBtn: string;
  modalTitle: string;
  descriptionModal: string;
  labelRegister: string;
  labelBtnModal: string;
  totalMoney?: string | number;
  currency?: string;
}

// FORMSCHEMA DE RENDIMENTO
const formSchemaProfit = z.object({
  money: z
    .string()
    .regex(/^\d*\.?\d*$/, "Apenas números e ponto são permitidos"),
  month: z.string().min(1, {
    message: "Insira um mês válido.",
  }),
  year: z.string().min(1, {
    message: "Insira um ano válido.",
  }),
});

// FORMSCHEMA DE RESGATE
const formSchemaWithdraw = z.object({
  money: z
    .string()
    .min(1, {
      message: "Insira um valor.",
    })
    .regex(/^\d*\.?\d*$/, "Apenas números e ponto são permitidos"),
  date: z.date({
    required_error: "Insira uma data válida.",
  }),
});

const ModalTable = ({
  action,
  financeId,
  initialDate,
  endDate,
  textBtn,
  modalTitle,
  descriptionModal,
  labelRegister,
  labelBtnModal,
  totalMoney,
  currency,
}: ModalTableProps) => {
  const [loadingProfit, setLoadingProfit] = useState<boolean>(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const separateMonthAndYear = (date: Date) => {
    const dateString = new Date(date).toLocaleDateString("pt-BR");
    const parts = dateString.split("/");
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const dateObject = new Date(`${year}/${month}/${day}`);

    const monthNumber = dateObject.getMonth() + 1;

    const fullYear = dateObject.getFullYear();

    return { monthNumber, fullYear };
  };

  // FUNÇÕES CASO SEJA REGISTRO DE RENDIMENTO
  const form = useForm<z.infer<typeof formSchemaProfit>>({
    resolver: zodResolver(formSchemaProfit),
    defaultValues: {
      money: "",
      month: separateMonthAndYear(initialDate).monthNumber.toString(),
      year: separateMonthAndYear(initialDate).fullYear.toString(),
    },
  });

  const { reset } = form;

  async function onSubmitProfit(values: z.infer<typeof formSchemaProfit>) {
    setLoadingProfit(true);
    const createProfit = await createNewProfit(
      financeId,
      parseInt(values.month),
      parseInt(values.year),
      values.money === "" ? 0 : parseFloat(values.money),
    );

    if (!createProfit) {
      toast.error("Ocorreu um erro, por favor, tente novamente.", {
        position: "bottom-center",
      });
      reset();
      return setLoadingProfit(false);
    }

    toast.success("Rendimento registrado com sucesso!", {
      position: "bottom-center",
    });
    reset();
    return setLoadingProfit(false);
  }

  // FUNÇÕES CASO SEJA REGISTRO DE RESGATE
  const formWithdraw = useForm<z.infer<typeof formSchemaWithdraw>>({
    resolver: zodResolver(formSchemaWithdraw),
    defaultValues: {
      money: "",
    },
  });

  const { reset: resetWithdraw } = formWithdraw;
  async function onSubmitWithdraw(values: z.infer<typeof formSchemaWithdraw>) {
    setLoadingWithdraw(true);

    if (values.money > totalMoney!) {
      toast.error("O valor de resgate deve ser menor que o total.", {
        position: "bottom-center",
      });
      return setLoadingWithdraw(false);
    }

    const createWithdraw = await createNewWithdraw(
      financeId,
      parseFloat(values.money),
      values.date,
    );

    if (!createWithdraw) {
      toast.error("Ocorreu um erro, por favor, tente novamente.", {
        position: "bottom-center",
      });
      resetWithdraw();
      return setLoadingWithdraw(false);
    }

    toast.success("Resgate registrado com sucesso!", {
      position: "bottom-center",
    });
    resetWithdraw();
    return setLoadingWithdraw(false);
  }

  // calculates the limit month to record profit according to the selected year
  const calculatesFinalMonth = (
    yearOfMaturity: number,
    monthOfMaturity: number,
    selectedYear: number,
  ) => {
    if (selectedYear === yearOfMaturity) {
      return monthOfMaturity;
    }

    return 12;
  };

  // calculates the minimum month to record profit according to the selected year
  const calculatesStartingMonth = (
    selectedYear: number,
    initialYear: number,
    initialMonth: number,
    yearOfMaturity: number | null,
  ) => {
    if (selectedYear === initialYear) {
      return initialMonth;
    }
    if (!yearOfMaturity && selectedYear === initialYear) {
      return initialMonth;
    }

    return 1;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full uppercase">
          {textBtn}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2 text-center">{modalTitle}</DialogTitle>
          <DialogDescription className="text-center font-medium">
            {descriptionModal}
          </DialogDescription>
        </DialogHeader>

        {action === "profit" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitProfit)}
              className="mt-5 flex flex-col gap-8 px-5"
            >
              <FormField
                control={form.control}
                name="money"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labelRegister}:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loadingProfit}
                        placeholder="Insira um valor"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loadingProfit}
                        min={calculatesStartingMonth(
                          Number(form.getValues("year")),
                          separateMonthAndYear(initialDate!).fullYear,
                          separateMonthAndYear(initialDate!).monthNumber,
                          separateMonthAndYear(endDate!).fullYear,
                        )}
                        max={calculatesFinalMonth(
                          separateMonthAndYear(endDate!).fullYear,
                          separateMonthAndYear(endDate!).monthNumber,
                          Number(form.getValues("year")),
                        )}
                        placeholder="1 = Janeiro, 2 = Fevereiro..."
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loadingProfit}
                        min={separateMonthAndYear(initialDate).fullYear}
                        max={
                          endDate === null
                            ? undefined
                            : separateMonthAndYear(endDate).fullYear
                        }
                        placeholder="Insira o ano"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full uppercase"
                  disabled={loadingProfit}
                >
                  salvar {labelBtnModal}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {action === "withdraw" && (
          <Form {...formWithdraw}>
            <form
              onSubmit={formWithdraw.handleSubmit(onSubmitWithdraw)}
              className="mt-5 flex flex-col gap-8 px-5"
            >
              <FormField
                control={formWithdraw.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do resgate:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Data do resgate</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(initialDate) ||
                            totalMoney === 0 ||
                            (endDate !== null && date > new Date(endDate))
                              ? true
                              : false
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col">
                <FormField
                  control={formWithdraw.control}
                  name="money"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labelRegister}:</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loadingWithdraw || totalMoney === 0}
                          placeholder="Insira o valor resgatado"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {Number(totalMoney) >= 0 && (
                  <p className="mt-2 text-xs">
                    Disponível para resgate:{" "}
                    {formatCurrency(Number(totalMoney), currency!)}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full uppercase"
                  disabled={loadingWithdraw}
                >
                  salvar {labelBtnModal}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTable;
