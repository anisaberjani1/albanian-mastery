"use client";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useKey } from "react-use";
import { Volume2 } from "lucide-react"; // 🎧 icon
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

  const handleListen = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    try {
      if (playing) return;
      setPlaying(true);

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
        console.error("TTS fetch failed:", await res.text());
        setPlaying(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      ttsCache.current.set(text, url);

      const audio = new Audio(url);
      audio.onended = () => setPlaying(false);
      audio.play().catch(() => setPlaying(false));
    } catch (error) {
      console.error("TTS error:", error);
      setPlaying(false);
    }
  }, [text, playing]);

  const handleCardClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  useKey(shortcut, handleCardClick, {}, [handleCardClick]);

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2",
        selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
        selected &&
          status === "correct" &&
          "border-green-300 bg-green-100 hover:bg-green-100",
        selected &&
          status === "wrong" &&
          "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-white",
        type === "ASSIST" && "lg:p-3 w-full"
      )}
    >
      {imageSrc && (
        <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
          <Image src={imageSrc} fill alt={text} />
        </div>
      )}

      <div
        className={cn(
          "flex items-center justify-between",
          type === "ASSIST" && "flex-row-reverse"
        )}
      >
        {type === "ASSIST" && <div />}
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-neutral-600 text-sm lg:text-base",
              selected && "text-sky-500",
              selected && status === "correct" && "text-green-500",
              selected && status === "wrong" && "text-rose-500"
            )}
          >
            {text}
          </p>

          <Button
            onClick={handleListen}
            disabled={playing}
            variant="super"
            size="sm"
            title="Listen"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn(
            "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
            selected && "border-sky-300 text-sky-500",
            selected &&
              status === "correct" &&
              "border-green-500 text-green-500",
            selected && status === "wrong" && "border-rose-500 text-rose-500"
          )}
        >
          {shortcut}
        </div>
      </div>
    </div>
  );
};
