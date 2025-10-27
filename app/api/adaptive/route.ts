import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { adaptiveChallenges } from "@/db/schema";
import { openai } from "@/lib/openai";

function determineNextDifficulty(accuracy: number, current: string) {
  if (accuracy >= 85) return "hard";
  if (accuracy <= 50) return "easy";
  return current || "medium";
}

export async function POST(req: Request) {
  try {
    const {
      userId,
      topic,
      accuracy = 0,
      currentDifficulty = "medium",
    } = await req.json();

    if (!userId || !topic) {
      return NextResponse.json(
        { error: "Missing userId or topic" },
        { status: 400 }
      );
    }

    const nextDifficulty = determineNextDifficulty(accuracy, currentDifficulty);

    const prompt = `
You are an AI exercise generator for an Albanian language learning app.
Generate **up to 2 adaptive challenges** focused on the topic "${topic}" and difficulty "${nextDifficulty}".
Each challenge should have:
      - type: either "SELECT" or "ASSIST"
      - question in English
      - 4 answer options with 1 correct
Return only valid JSON in this format:
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
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    let aiText = response.choices[0].message?.content || "";
    aiText = aiText.trim().replace(/```json|```/g, "");

    let generated;
    try {
      generated = JSON.parse(aiText);
    } catch {
      console.error("❌ Invalid JSON from AI:", aiText);
      return NextResponse.json(
        { error: "Invalid JSON from AI" },
        { status: 500 }
      );
    }

    const trimmed = generated.slice(0, 2);

    await db.insert(adaptiveChallenges).values({
      userId,
      topic,
      difficulty: nextDifficulty,
      accuracy,
      feedback: `Generated ${trimmed.length} adaptive challenges.`,
    });

    return NextResponse.json({
      success: true,
      difficulty: nextDifficulty,
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
