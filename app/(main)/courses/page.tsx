import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

const CoursesPage = async () => {
    const coursesData = getCourses();
    const userProgressData = getUserProgress();

    const[courses, userProgress] = await Promise.all([coursesData, userProgressData]);

  return (
    <div className="h-full max-w-[912px] mx-auto py-6">
        <h1 className="text-3xl font-semibold text-[var(--heading)] mb-8">
            Language Courses
        </h1>
        <List
            courses={courses} activeCourseId={userProgress?.activeCourseId}
        />
    </div>
    );
};

export default CoursesPage;
