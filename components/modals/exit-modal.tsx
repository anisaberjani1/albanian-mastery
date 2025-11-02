"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";
import { useEffect, useState } from "react";

export const ExitModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useExitModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-8">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <Image
            src="/mascot_sad.png"
            alt="Mascot"
            height={80}
            width={80}
            className="opacity-90"
          />

          <DialogTitle className="text-center font-bold text-2xl">
            Leaving so soon?
          </DialogTitle>
          <DialogDescription className="text-base text-paragraph leading-relaxed text-center">
            You’re about to exit this lesson.
            <br />
            Your current progress will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-6">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            size="lg"
            onClick={() => {
              close();
              router.push("/learn");
            }}
          >
            Exit Lesson
          </Button>
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            size="lg"
            onClick={close}
          >
            Keep learning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
