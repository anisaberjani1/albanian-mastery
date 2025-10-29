"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stat {
  id: number;
  topic: string;
  difficulty: string;
  accuracy: number;
}

export const LearningProgress = () => {
  const [data, setData] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/stats");
      const json = await res.json();
      if (!json.error) {
        const converted = json.map((item: Stat, index: number) => ({
          session: index + 1,
          topic: item.topic,
          accuracy: item.accuracy ?? 0,
          difficulty:
            item.difficulty === "EASY"
              ? 30
              : item.difficulty === "MEDIUM"
              ? 60
              : 90,
        }));
        setData(converted);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full bg-[var(--background)] py-24 px-6">
      <div className="max-w-[1100px] mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--heading)] mb-10">
          Your Adaptive Learning Progress
        </h2>
        <p className="text-[var(--paragraph)] max-w-[600px] mx-auto mb-16">
          The chart below visualizes how your accuracy improves as AI increases
          the challenge difficulty.
        </p>

        <div className="bg-[var(--primary)]/5 rounded-[1.15rem] p-10 shadow-[0_8px_20px_rgba(17,70,143,0.08)]">
          {data.length === 0 ? (
            <p className="text-[var(--paragraph)] italic">No progress yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid
                  stroke="var(--muted)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="session" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--paragraph)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Accuracy (%)"
                />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  stroke="var(--secondary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Difficulty Level"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          <div className="flex justify-center gap-8 mt-6 text-sm text-[var(--paragraph)]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--primary)]"></span>
              <span>Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--secondary)]"></span>
              <span>Difficulty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
