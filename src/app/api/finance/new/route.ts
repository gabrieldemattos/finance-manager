import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json();

  const {
    userId,
    financeName,
    initialInvestment,
    startDate,
    endDate,
    currency,
  } = req;

  if (!userId) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "USER_NOT_FOUND",
        },
      }),
    );
  }

  if (endDate !== null && new Date(startDate) > new Date(endDate)) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "DATE_ERROR",
        },
      }),
    );
  }

  if (Math.sign(initialInvestment) !== 1) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "INVALID_INITIAL_INVESTMENT",
        },
      }),
    );
  }

  if (financeName.length > 15) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "INVALID_NAME",
        },
      }),
    );
  }

  try {
    await prismaClient.finance.create({
      data: {
        userId,
        financeName,
        startDate: new Date(startDate),
        endDate: endDate === null ? null : new Date(endDate),
        initialInvestment,
        currency,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
      }),
      { status: 201 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: {
          code: "DATABASE_ERROR",
          message: "Ocorreu um erro ao salvar no banco de dados.",
        },
      }),
    );
  }
}
