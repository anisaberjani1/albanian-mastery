"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  hearts: number;
  points: number;
};

export const Items = ({ hearts, points}: Props) => {
  const [pending, startTransition] = useTransition();
  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return;
    }

    startTransition(() => {
      refillHearts().catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <ul className="divide-y divide-border text-left max-w-lg mx-auto">
      <li className="flex items-center justify-between w-full p-5">
        <div className="flex items-center gap-4">
          <Image src="/heart.png" alt="heart" height={45} width={45} />
          <div>
            <p className="text-lg font-semibold text-foreground">
              Refill hearts
            </p>
            <p className="text-sm text-muted-foreground">
              Use your points to restore hearts and continue learning.
            </p>
          </div>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
          className="flex items-center gap-1"
        >
          {hearts === 5 ? (
            "full"
          ) : (
            <>
              <Image src="/points.png" alt="points" height={18} width={18} className="mr-1" />
              <p>{POINTS_TO_REFILL}</p>
            </>
          )}
        </Button>
      </li>
      <li className="flex items-center justify-between w-full p-5">
        <div className="flex items-center gap-4">
          <Image src="/heart.png" alt="heart" height={40} width={40} />
          <div>
            <p className="text-lg font-semibold text-foreground">
              Practice Sessions
            </p>
            <p className="text-sm text-muted-foreground">
              Practice to regain hearts and earn bonus points.
            </p>
          </div>
        </div>
        <Button variant="secondary" className="px-4" onClick={() => toast.info("Open practice from Learn page")}>
          Practice
        </Button>
      </li>
    </ul>
  );
};
