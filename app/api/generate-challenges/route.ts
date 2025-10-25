import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

import { challenges, challengeOptions } from "@/db/schema";
import db from "@/db/drizzle";

export async function POST(req: Request) {
  try {
    const { lessonId, topic } = await req.json();

    if (!lessonId || !topic) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const prompt = `
      You are an AI exercise generator for an Albanian learning app.
      Create 4 simple challenges for the topic "${topic}".
      Each challenge should have:
      - type: either "SELECT" or "ASSIST"
      - question in English
      - 4 answer options with 1 correct
      Return only valid JSON like this:
      [
        {
          "type": "SELECT",
          "question": "Which one means 'the apple'?",
          "options": [
            {"text": "molla", "correct": true},
            {"text": "bananja", "correct": false},
            {"text": "dardha", "correct": false}
            {"text": "arra", "correct": false}
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

    let challengesData;
    try {
      challengesData = JSON.parse(aiText);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("❌ Invalid JSON from AI:", aiText);
      return NextResponse.json(
        { error: "Invalid JSON from AI" },
        { status: 500 }
      );
    }

    console.log("✅ Generated challenges:", JSON.stringify(challengesData, null, 2));

    for (const [index, ch] of challengesData.entries()) {
      const [newChallenge] = await db
        .insert(challenges)
        .values({
          lessonId,
          type: ch.type.toUpperCase() === "ASSIST" ? "ASSIST" : "SELECT",
          question: ch.question,
          order: index + 1,
        })
        .returning({ id: challenges.id });

      for (const opt of ch.options) {
        await db.insert(challengeOptions).values({
          challengeId: newChallenge.id,
          text: opt.text,
          correct: opt.correct,
          imageSrc: null,
          audioSrc: null,
        });
      }
    }

    return NextResponse.json({ success: true, challenges: challengesData });
  } catch (error) {
    console.error("🔥 Error in generate-challenges route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
