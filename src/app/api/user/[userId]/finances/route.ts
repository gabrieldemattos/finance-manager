import { prismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
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
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 },
    );
  }
}
