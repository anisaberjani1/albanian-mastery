import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { SplitCard } from "./split-card";

type Props = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {
  return (
    <div
      className={cn(
        "grid w-full gap-8 rounded-2xl border border-border bg-card shadow-sm p-6",
        "lg:grid-cols-[35%_minmax(0,1fr)] grid-cols-1"
      )}
    >
      <div className="flex flex-col items-center justify-center px-4 text-center">
        {type === "ASSIST" ? (
          <p className="text-lg font-semibold text-heading leading-relaxed">
            Select the correct meaning
          </p>
        ) : (
          <p className="text-lg font-semibold text-heading leading-relaxed">
            Choose the correct translation
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 overflow-visible w-full">
        {options.map((option) => (
          <SplitCard
            key={option.id}
            id={option.id}
            text={option.text}
            imageSrc={option.imageSrc}
            audioSrc={option.audioSrc}
            selected={selectedOption === option.id}
            status={status}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
