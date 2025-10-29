import { HowItWorks } from "./how-it-works";
import { LearningProgress } from "./learning-progress";
import { Features } from "./features";
import { Hero } from "./hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <LearningProgress />
      <HowItWorks />
    </>
  );
}
