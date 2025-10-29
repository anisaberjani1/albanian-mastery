"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const Features = () => {
  return (
    <section className="w-full bg-[var(--section)] py-28 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--heading)] mb-12">
          What Makes It Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[1.15rem] p-8 shadow-[0_8px_20px_rgba(17,70,143,0.08)] hover:shadow-[0_12px_25px_rgba(17,70,143,0.12)] transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[var(--heading)]">
                Adaptive AI Challenges
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)] leading-relaxed mt-2">
                Every exercise adjusts automatically to your progress — giving
                you the right level of challenge every time.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[1.15rem] p-8 shadow-[0_8px_20px_rgba(17,70,143,0.08)] hover:shadow-[0_12px_25px_rgba(17,70,143,0.12)] transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[var(--heading)]">
                Real-Time Speech Practice
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)] leading-relaxed mt-2">
                Listen, speak, and get immediate pronunciation feedback powered
                by AI speech analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[var(--card)] text-[var(--card-foreground)] rounded-[1.15rem] p-8 shadow-[0_8px_20px_rgba(17,70,143,0.08)] hover:shadow-[0_12px_25px_rgba(17,70,143,0.12)] transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[var(--heading)]">
                Track Your Progress
              </CardTitle>
              <CardDescription className="text-[var(--paragraph)] leading-relaxed mt-2">
                Visualize your growth, accuracy, and learning streaks in your
                personalized dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};
