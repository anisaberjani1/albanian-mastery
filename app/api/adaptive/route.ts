import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { adaptiveChallenges } from "@/db/schema";
import { openai } from "@/lib/openai";

function determineNextDifficulty(accuracy: number, current: string) {
  if (accuracy >= 85) return "HARD";
  if (accuracy <= 50) return "EASY";
  return current?.toUpperCase() || "MEDIUM";
}

function calculateAccuracy(attempts: number): number {
  const penalty = (attempts - 1) * 30;
  return Math.max(10, 100 - penalty);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      topic,
      attempts = 1,
      currentDifficulty = "MEDIUM",
    } = body;

    if (!userId || !topic) {
      return NextResponse.json(
        { error: "Missing userId or topic" },
        { status: 400 }
      );
    }

    const accuracy = calculateAccuracy(attempts);
    const nextDifficulty = determineNextDifficulty(accuracy, currentDifficulty);

    const prompt = `
You are an Albanian language learning AI generator.
Generate exactly 2 adaptive challenges for the topic "${topic}" at difficulty "${nextDifficulty}".
Each challenge must strictly follow this JSON format (no text outside the JSON):
[
  {
    "type": "SELECT",
    "question": "Which word means 'the apple'?",
    "options": [
      { "text": "molla", "correct": true },
      { "text": "dardha", "correct": false },
      { "text": "bananja", "correct": false },
      { "text": "arra", "correct": false }
    ]
  }
]
Ensure the entire response is valid JSON only.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    let aiText = response.choices[0].message?.content?.trim() || "";
    aiText = aiText.replace(/```json|```/g, "").trim();

    let generated = [];
    try {
      generated = JSON.parse(aiText);
      if (!Array.isArray(generated)) throw new Error("Expected an array of challenges");
    } catch (err) {
      console.error("❌ Adaptive challenge JSON error:", aiText);
      return NextResponse.json(
        { error: "AI returned invalid JSON structure", raw: aiText },
        { status: 400 }
      );
    }

    const trimmed = generated.slice(0, 2);

    await db.insert(adaptiveChallenges).values({
      userId,
      topic,
      difficulty: nextDifficulty,
      accuracy,
      feedback: `Generated ${trimmed.length} adaptive challenges at ${nextDifficulty} difficulty.`,
    });

    return NextResponse.json({
      success: true,
      difficulty: nextDifficulty,
      accuracy,
      challenges: trimmed,
    });
  } catch (error) {
    console.error("🔥 Error in /api/adaptive:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
