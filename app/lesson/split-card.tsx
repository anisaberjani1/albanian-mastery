"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
};

export const SplitCard = ({
  imageSrc,
  text,
  selected,
  onClick,
  disabled,
  status,
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

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full border border-border rounded-lg px-4 py-3 transition-all cursor-pointer",
        "hover:bg-section",
        selected && "border-primary bg-primary/5",
        selected && status === "correct" && "border-green-500 bg-green-50",
        selected && status === "wrong" && "border-rose-500 bg-rose-50",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-4">
        {imageSrc && (
          <div className="relative w-[60px] h-[60px] rounded-md overflow-hidden border border-border bg-muted">
            <Image
              src={imageSrc}
              alt={text}
              fill
              className="object-contain"
            />
          </div>
        )}
        <p className="text-base text-foreground leading-relaxed break-words whitespace-normal w-full">
          {text}
        </p>
      </div>

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
  );
};
