"use server";

import { prismaClient } from "@/lib/prisma";

export const deleteFinance = async (financeId: string) => {
  const finance = await prismaClient.finance.delete({
    where: {
      id: financeId,
    },
  });

  return finance;
};
