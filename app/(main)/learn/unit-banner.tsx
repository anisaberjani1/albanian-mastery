import { Button } from "@/components/ui/button";
import { NotebookText } from "lucide-react";
import Link from "next/link";

type Props = { title: string; description: string };

export const UnitBanner = ({ title, description }: Props) => {
  return (
    <div className="w-full bg-section border border-border rounded-xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-heading">{title}</h2>
        <p className="text-paragraph max-w-xl">{description}</p>
      </div>
      <Link href="/lesson" className="mt-4 sm:mt-0">
        <Button
          size="lg"
          variant="default"
          className="bg-primary text-white rounded-md font-medium hover:bg-primary/90"
        >
          <NotebookText className="mr-2 h-5 w-5" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
