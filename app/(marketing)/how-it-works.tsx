"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      color: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      description:
        "Create your account and set your skill level to get started.",
    },
    {
      number: 2,
      title: "Start Learning",
      color: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      description:
        "Engage with adaptive lessons designed to match your knowledge level.",
    },
    {
      number: 3,
      title: "Practice with AI",
      color: "bg-[var(--accent)] text-[var(--accent-foreground)]",
      description:
        "Speak, write, and get instant feedback from the AI-based evaluator.",
    },
    {
      number: 4,
      title: "Track Progress",
      color: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      description:
        "See how your accuracy and confidence improve over time.",
    },
  ];

  return (
    <section className="w-full bg-[var(--section)] py-28 px-6">
      <div className="max-w-[1100px] mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--heading)] mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-6">
          {steps.map((step) => (
            <HoverCard key={step.number}>
              <HoverCardTrigger asChild>
                <div className="flex flex-col items-center text-center gap-4 cursor-pointer group">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${step.color} font-bold text-lg shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--heading)] group-hover:text-[var(--primary)] transition-colors">
                    {step.title}
                  </h3>
                </div>
              </HoverCardTrigger>

              <HoverCardContent
                side="bottom"
                align="center"
                className="text-[var(--paragraph)] text-sm leading-relaxed max-w-[220px] mx-auto shadow-md"
              >
                {step.description}
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
};
