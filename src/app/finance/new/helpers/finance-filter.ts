import { checkApplicationHasExpired } from "@/utils/utils";
import { Finance } from "@prisma/client";

export const checkFilter = (finances: Finance[], filter: string) => {
  const copyFinances = [...finances];

  switch (filter) {
    case "recently-created":
      return copyFinances.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "old-to-new":
      return copyFinances.toSorted(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case "no-end-date":
      return copyFinances.filter((finance) => !finance.endDate);
    case "expiration-date-ascending":
      return copyFinances
        .filter((finance) => finance.endDate)
        .toSorted(
          (a, b) =>
            new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime(),
        );
    case "expiration-date-descending":
      return copyFinances
        .filter((finance) => finance.endDate !== null)
        .toSorted(
          (a, b) =>
            new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime(),
        );
    case "initial-investment-ascending":
      return copyFinances.toSorted(
        (a, b) => a.initialInvestment - b.initialInvestment,
      );
    case "initial-investment-descending":
      return copyFinances.toSorted(
        (a, b) => b.initialInvestment - a.initialInvestment,
      );
    case "currency-euro":
      return copyFinances.filter((finance) => finance.currency === "EUR");
    case "currency-real":
      return copyFinances.filter((finance) => finance.currency === "BRL");
    case "currency-dollar":
      return copyFinances.filter((finance) => finance.currency === "USD");
    case "expired":
      return copyFinances.filter(
        (finance) =>
          checkApplicationHasExpired(finance.endDate!) && finance.endDate,
      );
    default:
      return finances;
  }
};

//all filters
export const filters = [
  {
    value: "recently-created",
    label: "Mais recentes primeiro",
  },
  {
    value: "old-to-new",
    label: "Mais antigas primeiro",
  },
  {
    value: "no-end-date",
    label: "Sem data de vencimento",
  },
  {
    value: "expiration-date-ascending",
    label: "Ordem de vencimento crescente",
  },
  {
    value: "expiration-date-descending",
    label: "Ordem de vencimento decrescente",
  },
  {
    value: "initial-investment-ascending",
    label: "Ordem de aplicação inicial crescente",
  },
  {
    value: "initial-investment-descending",
    label: "Ordem de aplicação inicial decrescente",
  },
  {
    value: "currency-euro",
    label: "Moeda: Euro",
  },
  {
    value: "currency-real",
    label: "Moeda: Real Brasileiro",
  },
  {
    value: "currency-dollar",
    label: "Moeda: Dólar",
  },
  {
    value: "expired",
    label: "Vencidas",
  },
];
