import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params: { userId },
  }: {
    params: { userId: string };
  },
) {
  if (!userId) {
    return {
      status: 400,
      body: {
        message: "Missing userId",
      },
    };
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      finances: true,
    },
  });

  return new NextResponse(JSON.stringify(user), { status: 200 });
}
