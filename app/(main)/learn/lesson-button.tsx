"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

export const LessonButton = ({
  id,
  index,
  locked,
  current,
}: Props) => {
  const isCompleted = !current && !locked;
  const href = locked ? "#" : `/lesson/${id}`;

  return (
    <Link href={href} style={{ pointerEvents: locked ? "none" : "auto" }}>
      <div
        className={cn(
          "flex items-center justify-between w-full border border-border rounded-lg px-5 py-4 transition-all duration-150",
          locked
            ? "bg-muted cursor-not-allowed opacity-60"
            : current
            ? "bg-primary/5 hover:bg-primary/10"
            : "bg-card hover:bg-section"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-1.5 h-10 rounded-full",
              locked
                ? "bg-muted"
                : current
                ? "bg-primary"
                : "bg-secondary/60"
            )}
          />
          <div className="flex flex-col">
            <h4
              className={cn(
                "text-lg font-semibold",
                locked
                  ? "text-muted-foreground"
                  : current
                  ? "text-heading"
                  : "text-foreground"
              )}
            >
              Lesson {index + 1}
            </h4>
            <p className="text-sm text-muted-foreground">
              {locked
                ? "Locked"
                : current
                ? "In progress"
                : isCompleted
                ? "Completed"
                : "Not started"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {locked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : isCompleted ? (
            <CheckCircle className="h-5 w-5 text-secondary" />
          ) : (
            <PlayCircle
              className={cn(
                "h-6 w-6",
                current ? "text-primary" : "text-muted-foreground"
              )}
            />
          )}
        </div>
      </div>
    </Link>
  );
};
