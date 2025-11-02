import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";

const ShopPage = async () => {
  const userProgressData = getUserProgress();

  const [userProgress] = await Promise.all([userProgressData]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-section px-6 py-6">
      <div className="max-w-[950px] mx-auto space-y-8">
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
        <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center">
          <div className="flex flex-col items-center mb-8">
            <Image src="/shop.png" alt="shop" height={90} width={90} />
            <h1 className="text-3xl font-bold text-heading mt-4">
                Shop
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
                Spend your points to refill hearts and keep learning.
            </p>
          </div>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
