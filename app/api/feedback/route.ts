import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const {
      question,
      userAnswer,
      correctAnswer,
      attempt = 1,
    } = await req.json();

    if (!question || !userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: "Missing question or answers" },
        { status: 400 }
      );
    }

    let prompt = "";

    if (attempt === 1) {
      prompt = `
You are an Albanian language tutor.
The student gave a wrong answer once.
Explain briefly (in one short friendly sentence) why their answer is wrong.
DO NOT reveal the correct answer.
Be supportive and educational.

Question: ${question}
User's answer: ${userAnswer}
Correct answer (for your reference only): ${correctAnswer}
      `;
    } else if (attempt === 2) {
      const hint = correctAnswer[0];
      prompt = `
You are an Albanian language tutor.
The student got the same question wrong again.
Give them a gentle hint using the first letter of the correct answer ("${hint}").
Do NOT say the full word. Encourage them to think.

Question: ${question}
User's answer: ${userAnswer}
Correct answer (for your reference only): ${correctAnswer}
      `;
    } else {
      prompt = `
You are an Albanian tutor.
The student keeps missing the same question.
Now reveal the correct answer politely, after encouragement.

Question: ${question}
User's answer: ${userAnswer}
Correct answer: ${correctAnswer}
      `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const explanation =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Keep trying! You’re close.";

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("❌ Feedback generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback." },
      { status: 500 }
    );
  }
}
