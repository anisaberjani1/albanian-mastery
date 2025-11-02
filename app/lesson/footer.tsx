import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({ onCheck, status, disabled, lessonId }: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)", false);

  return (
    <footer
      className={cn(
        "w-full border-t border-border bg-card py-6 px-8 flex items-center justify-between",
        status === "correct" && "bg-green-50",
        status === "wrong" && "bg-rose-50"
      )}
    >
      {status === "correct" && (
        <div className="text-green-600 font-semibold flex items-center gap-2 text-base lg:text-lg">
          <CheckCircle className="h-6 w-6" />
          Great job!
        </div>
      )}
      {status === "wrong" && (
        <div className="text-rose-600 font-semibold flex items-center gap-2 text-base lg:text-lg">
          <XCircle className="h-6 w-6" />
          Try again.
        </div>
      )}
      {status === "completed" && (
        <Button
          variant="secondary"
          size={isMobile ? "sm" : "lg"}
          onClick={() => (window.location.href = `/lesson/${lessonId}`)}
        >
          Practice again
        </Button>
      )}
      <Button
        disabled={disabled}
        onClick={onCheck}
        size={isMobile ? "sm" : "lg"}
        variant={status === "wrong" ? "danger" : "secondary"}
        className="ml-auto"
      >
        {status === "none" && "Check"}
        {status === "correct" && "Next"}
        {status === "wrong" && "Retry"}
        {status === "completed" && "Continue"}
      </Button>
    </footer>
  );
};
