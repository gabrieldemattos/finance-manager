import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params: { userId },
  }: {
    params: { userId: string };
  },
): Promise<NextResponse> {
  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Missing userId" }), {
      status: 400,
    });
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
