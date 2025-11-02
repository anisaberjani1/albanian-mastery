import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc = variant === "hearts" ? "/heart.png" : "/points.png";
  const label = variant === "hearts" ? "Hearts left" : "Total XP";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-2xl border transition-all",
        "bg-card border-border shadow-sm hover:shadow-md hover:bg-section"
      )}
    >
      <div className="flex items-center gap-3">
        <Image
          src={imageSrc}
          alt={label}
          width={34}
          height={34}
          className={cn(
            "drop-shadow-sm",
            variant === "points" && "hue-rotate-[330deg]",
            variant === "hearts" && "brightness-110"
          )}
        />
        <span
          className={cn(
            "text-2xl font-semibold tracking-tight",
            variant === "hearts" && "text-rose-500",
            variant === "points" && "text-orange-500"
          )}
        >
          {value}
        </span>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
};
