//format currency
export const formatCurrency = (value: number, currency: string) => {
  switch (currency) {
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case "EUR":
      return new Intl.NumberFormat("de-De", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    default:
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
  }
};

//format date
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
export const formatDate = (date: Date) => {
  const formatDate = new Date(date);
  const formatedDate = format(formatDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return formatedDate;
};

//format date string
export const formatDateString = (dataString: string) => {
  const date = new Date(dataString);

  const formatedDate = format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  const shortFormatedDate = format(date, "dd'/'MM'/'yyyy", {
    locale: ptBR,
  });

  return { formatedDate, shortFormatedDate };
};

//investment currency
export const currency = (currency: string) => {
  switch (currency) {
    case "USD":
      return "Dólar Americano";
    case "EUR":
      return "Euro";
    default:
      return "Real Brasileiro";
  }
};

//check if application has expired
export const checkApplicationHasExpired = (endDate: null | Date) => {
  const today = new Date();

  if (endDate !== null) {
    const dueDate = new Date(endDate!);

    if (dueDate < today) {
      return true;
    } else {
      return false;
    }
  } else if (!endDate) {
    return "null";
  }

  return true;
};
