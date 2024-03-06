"use server";

import { prismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteProfit = async (id: string) => {
  const profit = await prismaClient.monthlyProfit.delete({
    where: {
      id: id,
    },
  });

  revalidatePath(`/finance/details/${profit.financeId}`);

  return profit;
};

export const deleteWithdraw = async (id: string) => {
  const withdraw = await prismaClient.moneyWithdraw.delete({
    where: {
      id: id,
    },
  });

  if (!withdraw) {
    return false;
  }

  revalidatePath(`/finance/details/${withdraw.financeId}`);

  return withdraw;
};
