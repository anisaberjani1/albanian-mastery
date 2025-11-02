import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/courses">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-primary/10 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 text-primary" />
        </Button>
      </Link>
      <h1 className="font-bold text-2xl text-[var(--heading)] tracking-tight">
        {title}
      </h1>
      <div />
    </div>
  );
};
