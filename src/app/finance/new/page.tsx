"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ptBR } from "date-fns/locale/pt-BR";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    financeName: z
      .string()
      .min(1, {
        message: "Insira um nome até 15 caracteres.",
      })
      .max(15, {
        message: "O nome deve ter no máximo 15 caracteres",
      }),
    initialInvestment: z.string().min(2, {
      message: "Insira um valor inicial válido.",
    }),
    currency: z.string().min(1, {
      message: "Selecione o tipo de moeda investido.",
    }),
    startDate: z.date({
      required_error: "Selecione uma data inicial.",
    }),
    endDate: z
      .date({
        required_error: "Selecione a data de vencimento.",
      })
      .optional(),
    noEndDate: z.boolean().default(false).optional(),
  })
  .refine(
    (data) => {
      if (data.noEndDate === false) {
        return data.endDate !== undefined;
      }
      data.endDate = undefined;
      return true;
    },
    {
      path: ["endDate"],
      message: "Seleciona a data de vencimento.",
    },
  )
  .refine(
    (data) => {
      if (data.noEndDate === false) {
        if (data.endDate && data.startDate < data.endDate) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    {
      message: "Data de vencimento deve ser maior que a data inicial.",
      path: ["endDate"],
    },
  );

const NewFinancePage = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [status]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financeName: "",
      initialInvestment: "",
      currency: "",
      noEndDate: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(
      `${(data?.user as any)?.id}/confirmation?financeName=${values.financeName}&initialInvestment=${values.initialInvestment}&currency=${values.currency}&startDate=${values.startDate?.toISOString()}&endDate=${values.endDate?.toISOString()}`,
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50">
      {status === "authenticated" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-8 px-20 md:w-[35rem]"
          >
            <FormField
              control={form.control}
              name="financeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da aplicação:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Exemplo: Poupança, LCI, LCA, Tesouro Direto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de início da aplicação:</FormLabel>
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
                            <span>Data inicial</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={ptBR}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              {!form.getValues("noEndDate") && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de vencimento da aplicação:</FormLabel>
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
                                <span>Data de vencimento</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={ptBR}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="noEndDate"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Sem data de vencimento</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="initialInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicação inicial:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valor inicial aplicado"
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecione a moeda:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Moeda da aplicação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BRL">Real</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                      <SelectItem value="USD">Dólar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button type="submit" className="uppercase">
                Concluir
              </Button>
              <Button
                variant="destructive"
                className="uppercase"
                onClick={() => router.push("/")}
              >
                Voltar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default NewFinancePage;
