import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params: { userId },
  }: {
    params: { userId?: string };
  },
): Promise<void | NextResponse> {
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

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  return new NextResponse(JSON.stringify(user), { status: 200 });
}
