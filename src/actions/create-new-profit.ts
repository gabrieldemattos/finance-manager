"use server";

import { prismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createNewProfit = async (
  financeId: string,
  month: number,
  year: number,
  profit: number,
) => {
  const newProfit = await prismaClient.monthlyProfit.create({
    data: {
      financeId,
      month,
      year,
      profit,
    },
  });

  await prismaClient.finance.update({
    where: {
      id: financeId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/finance/details/${financeId}`);
  return newProfit;
};
