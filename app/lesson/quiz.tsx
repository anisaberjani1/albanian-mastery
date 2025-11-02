/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { challengeOptions, challenges } from "@/db/schema";
import { useState, useTransition, useEffect, useRef } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { useMount } from "react-use";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
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
  lessonTitle = "General",
}: Props) => {
  const { user } = useUser();
  const userId = user?.id;
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

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
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
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
            setTotalAttempts((prev) => prev + 1);
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
              toast.success("You’ve completed all adaptive challenges!");
              setShowAdaptive(false);
              router.push("/learn");
            }
          }, 800);
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
          <Header hearts={hearts} percentage={percentage} />
          <div className="flex-1 flex items-center justify-center w-full px-6 py-10">
            <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-heading text-center mb-8">
                Adaptive Challenge {adaptiveIndex + 1}
              </h1>

              <div className="flex flex-col lg:grid lg:grid-cols-[40%_60%] gap-8 items-start">
                <div className="text-center lg:text-left">
                  <p className="text-lg font-medium text-foreground">
                    {adaptive.question}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full pr-6">
                  {adaptiveOptions.map((opt: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => onAdaptiveSelect(i)}
                      disabled={adaptiveStatus !== "none"}
                      className={cn(
                        "flex justify-between items-center border rounded-lg px-5 py-3 transition-all text-left",
                        "hover:bg-section focus:ring-2 focus:ring-primary/30",
                        adaptiveSelected === i &&
                          adaptiveStatus === "correct" &&
                          "border-green-500 bg-green-50",
                        adaptiveSelected === i &&
                          adaptiveStatus === "wrong" &&
                          "border-rose-500 bg-rose-50",
                        adaptiveSelected === i &&
                          adaptiveStatus === "none" &&
                          "border-primary bg-primary/5"
                      )}
                    >
                      <span className="text-base text-foreground">
                        {opt.text}
                      </span>
                      {opt.audio && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            new Audio(opt.audio).play().catch(() => {});
                          }}
                        >
                          <Volume2 className="h-4 w-4 text-primary" />
                        </Button>
                      )}
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
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-heading mb-4">
              Lesson Completed!
            </h1>
            <p className="text-muted-foreground mb-8">
              Great progress — you’ve completed all challenges in this lesson.
            </p>

            <div className="flex justify-center gap-8 mb-10">
              <ResultCard variant="points" value={challenges.length * 10} />
              <ResultCard variant="hearts" value={hearts} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => router.push("/learn")}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Back to Learning
              </Button>
              <Button
                onClick={async () => {
                  setAdaptiveLoading(true);
                  try {
                    const res = await fetch("/api/adaptive", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        topic,
                        attempts: Math.max(1, totalAttempts),
                        currentDifficulty: "medium",
                      }),
                    });

                    const data = await res.json();
                    if (data?.success && data?.challenges?.length) {
                      toast.success("Adaptive challenges ready!");
                      setAdaptiveChallenges(data.challenges);
                      setShowAdaptive(true);
                      setAdaptiveIndex(0);
                    } else {
                      toast.error("No adaptive challenges were generated.");
                    }
                  } catch {
                    toast.error("Error fetching adaptive challenges.");
                  } finally {
                    setAdaptiveLoading(false);
                  }
                }}
                disabled={adaptiveLoading}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {adaptiveLoading ? "Generating..." : `Try Adaptive Challenges`}
              </Button>
            </div>
          </div>
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
      <Header hearts={hearts} percentage={percentage} />
      <main className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-160px)] px-6 py-10 bg-section">
        <div className="w-full max-w-3xl flex flex-col gap-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-heading text-center">
            {title}
          </h1>

          {challenge.type === "ASSIST" && (
            <div className="flex justify-center">
              <QuestionBubble question={challenge.question} />
            </div>
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
            <p className="text-sm text-center text-secondary font-medium italic">
              💡 {feedback}
            </p>
          )}
        </div>
      </main>

      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
