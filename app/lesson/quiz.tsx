/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useState, useTransition, useEffect, useRef } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import Image from "next/image";
import Confetti from "react-confetti";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { useMount, useWindowSize } from "react-use";
import { Button } from "@/components/ui/button";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & { isActive: boolean })
    | null;
  lessonTitle?: string;
};

const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play().catch(() => {});
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  userSubscription,
  lessonTitle = "General",
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [pending, startTransition] = useTransition();

  // Core lesson state
  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() =>
    initialPercentage === 100 ? 0 : initialPercentage
  );
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const feedbackCache = useRef<Record<string, string>>({});

  const [adaptiveChallenges, setAdaptiveChallenges] = useState<any[]>([]);
  const [showAdaptive, setShowAdaptive] = useState(false);
  const [adaptiveLoading, setAdaptiveLoading] = useState(false);
  const [adaptiveIndex, setAdaptiveIndex] = useState(0);
  const [adaptiveStatus, setAdaptiveStatus] = useState<
    "none" | "correct" | "wrong"
  >("none");
  const [adaptiveSelected, setAdaptiveSelected] = useState<number | null>(null);

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const topic = lessonTitle || challenge?.question?.split(" ")[0] || "General";

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "warmup",
        userAnswer: "warmup",
        correctAnswer: "warmup",
      }),
    }).catch(() => {});
  });

  useEffect(() => {
    if (!challenge) playSound("/finish.wav");
  }, [challenge]);

  const onNext = () => {
    setActiveIndex((current) => current + 1);
    setAttempts(0);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;
    setFeedback(null);

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      setFeedback(null);
      return;
    }

    const correctOption = options.find((option) => option.correct);
    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            playSound("/correct.wav");
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);
            setAttempts(0);

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again!"));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            playSound("/incorrect.wav");
            setStatus("wrong");
            setAttempts((prev) => prev + 1);
            if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));

            const userOption = options.find((o) => o.id === selectedOption);
            if (!userOption || !correctOption) return;

            const cacheKey = `${challenge.id}_${userOption.text}`;
            const cached = feedbackCache.current[cacheKey];
            if (cached) {
              setFeedback(cached);
              return;
            }

            fetch("/api/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                question: challenge.question,
                userAnswer: userOption.text,
                correctAnswer: correctOption.text,
                attempt: attempts + 1,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                const explanation =
                  data.explanation || "No feedback available.";
                feedbackCache.current[cacheKey] = explanation;
                setFeedback(explanation);
              })
              .catch(() => setFeedback("Error generating feedback."));
          })
          .catch(() => toast.error("Something went wrong. Please try again!"));
      });
    }
  };

  if (!challenge) {
    if (showAdaptive && adaptiveChallenges.length > 0) {
      const adaptive = adaptiveChallenges[adaptiveIndex];
      const adaptiveOptions = adaptive.options ?? [];

      const onAdaptiveSelect = (i: number) => {
        if (adaptiveStatus !== "none") return;
        setAdaptiveSelected(i);
      };

      const onAdaptiveContinue = () => {
        if (adaptiveSelected === null) return;
        const correctIndex = adaptiveOptions.findIndex((o: any) => o.correct);

        if (correctIndex === adaptiveSelected) {
          playSound("/correct.wav");
          setAdaptiveStatus("correct");

          setTimeout(() => {
            if (adaptiveIndex + 1 < adaptiveChallenges.length) {
              setAdaptiveIndex((prev) => prev + 1);
              setAdaptiveSelected(null);
              setAdaptiveStatus("none");
            } else {
              toast.success("✅ You’ve completed all adaptive challenges!");
              setShowAdaptive(false);
              router.push("/learn");
            }
          }, 1000);
        } else {
          playSound("/incorrect.wav");
          setAdaptiveStatus("wrong");
          setTimeout(() => {
            setAdaptiveStatus("none");
            setAdaptiveSelected(null);
          }, 800);
        }
      };

      return (
        <>
          <div className="h-full flex flex-col items-center justify-center">
            <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12 pt-20">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700 ps-16">
                Adaptive Challenge {adaptiveIndex + 1}
              </h1>
              <div className="w-full max-w-md px-6 text-center">
                <p className="text-lg mb-6 font-semibold">
                  {adaptive.question}
                </p>
                <div className="flex flex-col gap-3">
                  {adaptiveOptions.map((opt: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => onAdaptiveSelect(i)}
                      disabled={adaptiveStatus !== "none"}
                      className={`border p-3 rounded-xl transition ${
                        adaptiveSelected === i
                          ? adaptiveStatus === "correct"
                            ? "border-emerald-500 bg-emerald-100"
                            : adaptiveStatus === "wrong"
                            ? "border-rose-500 bg-rose-100"
                            : "border-blue-400 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer
            disabled={adaptiveSelected === null}
            status={adaptiveStatus}
            onCheck={onAdaptiveContinue}
          />
        </>
      );
    }

    return (
      <>
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          tweenDuration={8000}
        />
        <div className="flex flex-col gap-y-6 items-center justify-center text-center h-full max-w-lg mx-auto mt-20">
          <Image
            src="/finish.png"
            alt="Finish"
            height={50}
            width={50}
            className="hidden lg:block"
          />
          <h1 className="text-2xl font-bold text-neutral-700">
            Great job! <br /> You’ve completed this lesson.
          </h1>

          <div className="flex items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>

          <Button
            onClick={async () => {
              setAdaptiveLoading(true);
              try {
                const res = await fetch("/api/adaptive", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: "test_user",
                    topic: topic,
                    accuracy: percentage,
                    currentDifficulty: "medium",
                  }),
                });

                const data = await res.json();
                if (data?.success && data?.challenges?.length) {
                  toast.success("Adaptive challenges generated!");
                  setAdaptiveChallenges(data.challenges);
                  setShowAdaptive(true);
                  setAdaptiveIndex(0);
                } else {
                  toast.error("No adaptive challenges were generated.");
                }
              } catch (err) {
                toast.error("Error fetching adaptive challenges.");
              } finally {
                setAdaptiveLoading(false);
              }
            }}
            disabled={adaptiveLoading}
            variant="primary"
            size="default"
          >
            {adaptiveLoading
              ? "Generating..."
              : `🔥 Try Extra Adaptive Challenges on ${topic}`}
          </Button>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12 pt-20">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>

            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}

              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />

              {feedback && (
                <p className="text-sm text-center text-rose-600 mt-4 italic">
                  💡 {feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
