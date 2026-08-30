import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "BUSINESS") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, industry, description, city } = body;

    const profile = await prisma.businessProfile.upsert({
      where: { userId: session.id },
      update: {
        businessName: name,
        industryCategory: industry,
        description,
        location: city,
      },
      create: {
        userId: session.id,
        businessName: name,
        industryCategory: industry,
        description,
        location: city,
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to save profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
