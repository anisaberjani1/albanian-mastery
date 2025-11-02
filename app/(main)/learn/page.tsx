import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }
  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-section px-6 py-6">
      <div className="max-w-[950px] mx-auto space-y-8">
        <Header title={userProgress.activeCourse.title} />

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
          />
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="text-center">
              <p className="text-[var(--heading)] font-semibold text-lg">
                {userProgress.points}
              </p>
              <p className="text-sm text-[var(--paragraph)]">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-[var(--heading)] font-semibold text-lg">
                {userProgress.hearts}
              </p>
              <p className="text-sm text-[var(--paragraph)]">Hearts Left</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-20 my-10">
          {units.map((unit) => (
              <Unit
                key={unit.id}
                id={unit.id}
                order={unit.order}
                description={unit.description}
                title={unit.title}
                lessons={unit.lessons}
                activeLesson={
                  courseProgress.activeLesson as
                    | (typeof lessons.$inferSelect & {
                        unit: typeof unitsSchema.$inferSelect;
                      })
                    | undefined
                }
                activeLessonPercentage={lessonPercentage}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
