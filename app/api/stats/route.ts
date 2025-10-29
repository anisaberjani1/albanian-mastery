import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { adaptiveChallenges } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await db
      .select()
      .from(adaptiveChallenges)
      .where(eq(adaptiveChallenges.userId, userId))
      .orderBy(adaptiveChallenges.id)
      .limit(20);

    console.log(`✅ Data fetched for user ${userId}:`, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
