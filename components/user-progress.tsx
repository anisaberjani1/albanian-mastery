import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { courses } from "@/db/schema";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
};

export const UserProgress = ({ activeCourse, hearts, points }: Props) => {
  return (
    <div className="flex items-center gap-4 pl-1">
      <Link href="/courses" aria-label="Go back to courses">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border hover:bg-primary/10 transition"
            width={36}
            height={36}
          />
      </Link>
      <Link href="/shop" aria-label="Open shop to refill hearts or view points">
        <div className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition">
          <div className="flex items-center text-yellow-400 font-semibold">
            <Star className="h-5 w-5 mr-1" />
            {points}
          </div>
          <div className="flex items-center text-rose-500 font-semibold">
            <Heart className="h-5 w-5 mr-1" />
            {hearts}
          </div>
        </div>
      </Link>
    </div>
  );
};
