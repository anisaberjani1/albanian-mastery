/* eslint-disable @typescript-eslint/ban-ts-comment */
/* @ts-nocheck */
import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

export default async function LessonIdPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lessonId = Number(params.lessonId);

  const [lesson, userProgress] = await Promise.all([
    getLesson(lessonId),
    getUserProgress(),
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
    />
  );
}
