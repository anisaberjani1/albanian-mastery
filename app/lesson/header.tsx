import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { X } from "lucide-react";
import Image from "next/image";

type Props = {
  hearts: number;
  percentage: number;
};

export const Header = ({ hearts, percentage }: Props) => {
  const { open } = useExitModal();

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-border bg-card">
      <X
        onClick={open}
        className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      />

      <div className="flex flex-col items-center flex-1 px-8">
        <Progress value={percentage} className="w-full h-2 rounded-full" />
      </div>

      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Image
          src="/heart.png"
          height={24}
          width={24}
          alt="heart"
          className="shrink-0"
        />
        <span className="text-primary">{hearts}</span>
      </div>
    </header>
  );
};
