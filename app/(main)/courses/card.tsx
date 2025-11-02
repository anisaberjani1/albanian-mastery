import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "relative flex flex-col items-center justify-between rounded-xl border border-border bg-white shadow-sm transition-all cursor-pointer p-4 hover:shadow-md hover:border-primary/40 active:scale-[0.98]",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {active && (
        <div className="absolute top-3 right-3 rounded-md bg-green-600 p-1.5 shadow-sm">
          <Check className="text-white stroke-[4] h-4 w-4" />
        </div>
      )}
      <div className="flex items-center justify-center h-[80px] w-[100px] mb-3">
        <Image
          src={imageSrc}
          alt={title}
          height={70}
          width={93}
          className="rounded-lg object-cover drop-shadow-md border border-border"
        />
      </div>
      <p
        className={cn(
          "text-center font-semibold text-[var(--heading)]",
          active && "text-primary"
        )}
      >
        {title}
      </p>
    </div>
  );
};
