"use server";

import { prismaClient } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createNewWithdraw = async (
  financeId: string,
  amount: number,
  date: Date,
) => {
  const newWithdraw = await prismaClient.moneyWithdraw.create({
    data: {
      financeId,
      amount,
      date,
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
  return newWithdraw;
};
