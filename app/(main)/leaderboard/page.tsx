import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const leaderboardData = getTopTenUsers();

  const [userProgress, leaderboard] = await Promise.all([
    userProgressData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-section px-6 py-6">
      <div className="max-w-[950px] mx-auto space-y-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-10">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/leaderboard.png"
              alt="leaderboard"
              height={90}
              width={90}
            />
            <h1 className="text-3xl font-bold text-heading mt-4">
                Leaderboard
            </h1>
            <p className="text-muted-foreground text-center text-lg mt-2">
                See how you rank among other learners.
            </p>
          </div>
          <Separator className="mb-4 h-0.5 rounded-full" />
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
                <div
                key={user.userId}
                className={`flex items-center w-full p-4 rounded-xl transition ${
                  index < 3
                    ? "bg-lime-50 border border-lime-200"
                    : "hover:bg-gray-50"
                }`}
                >
                <p
                  className={`font-bold mr-6 text-xl ${
                    index === 0
                      ? "text-yellow-500"
                      : index === 1
                      ? "text-gray-500"
                      : index === 2
                      ? "text-amber-700"
                      : "text-neutral-600"
                  }`}
                >{index + 1}</p>
                <Avatar className="border h-12 w-12 mr-4">
                    <AvatarImage
                    className="object-cover"
                    src={user.userImageSrc || "/mascot.png"}
                    alt={user.userName}
                    />
                </Avatar>
                <p className="font-semibold text-foreground flex-1">
                    {user.userName}
                </p>
                <p className="text-muted-foreground font-medium">{user.points} XP</p>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
