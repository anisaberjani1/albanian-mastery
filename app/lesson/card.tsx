"use client";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useKey } from "react-use";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: (typeof challenges.$inferSelect)["type"];
};

export const Card = ({
  imageSrc,
  text,
  shortcut,
  selected,
  onClick,
  disabled,
  status,
  type,
}: Props) => {
  const ttsCache = useRef<Map<string, string>>(new Map());
  const [playing, setPlaying] = useState(false);

  const handleListen = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (playing) return;
      setPlaying(true);

      try {
        if (ttsCache.current.has(text)) {
          const cachedUrl = ttsCache.current.get(text)!;
          new Audio(cachedUrl).play().catch(() => {});
          setPlaying(false);
          return;
        }

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          setPlaying(false);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        ttsCache.current.set(text, url);

        const audio = new Audio(url);
        audio.onended = () => setPlaying(false);
        audio.play().catch(() => setPlaying(false));
      } catch {
        setPlaying(false);
      }
    },
    [text, playing]
  );

  const handleCardClick = useCallback(() => {
    if (!disabled) onClick();
  }, [disabled, onClick]);

  useKey(shortcut, handleCardClick, {}, [handleCardClick]);

  const base =
    "border rounded-xl p-5 transition-all duration-150 cursor-pointer select-none border-border hover:bg-section";
  const state = cn(
    selected && "border-primary bg-primary/5",
    selected && status === "correct" && "border-green-500 bg-green-50",
    selected && status === "wrong" && "border-rose-500 bg-rose-50",
    disabled && "opacity-60 cursor-not-allowed"
  );

  // ASSIST → horizontal layout
  if (type === "ASSIST") {
    return (
      <div
        onClick={handleCardClick}
        className={cn(base, state, "flex items-center gap-5 w-full")}
      >
        {imageSrc && (
          <div className="relative flex-shrink-0 w-[80px] h-[80px] rounded-lg overflow-hidden border border-border bg-muted">
            <Image
              src={imageSrc}
              alt={text}
              fill
              className="object-contain bg-muted"
            />
          </div>
        )}

        <div className="flex items-start justify-between w-full">
          <p
            className={cn(
              "text-base leading-relaxed text-foreground",
              selected && "text-primary font-medium"
            )}
          >
            {text}
          </p>

          <Button
            onClick={handleListen}
            disabled={playing}
            variant="ghost"
            size="sm"
            className="ml-4 shrink-0"
          >
            <Volume2 className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
    );
  }

  // SELECT → vertical layout
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        base,
        state,
        "flex flex-col items-center justify-center text-center min-h-[200px] gap-4"
      )}
    >
      {imageSrc && (
        <div className="relative w-[100px] h-[100px] border border-border rounded-lg overflow-hidden bg-muted">
          <Image src={imageSrc} alt={text} fill className="object-contain" />
        </div>
      )}

      <p
        className={cn(
          "text-base leading-relaxed text-foreground whitespace-normal max-w-[90%]",
          selected && "text-primary font-medium"
        )}
      >
        {text}
      </p>

      <Button
        onClick={handleListen}
        disabled={playing}
        variant="ghost"
        size="sm"
        className="mt-1"
      >
        <Volume2 className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
};
