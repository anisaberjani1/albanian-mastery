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

interface ChartData {
  id: number;
  session: number;
  topic: string;
  accuracy: number;
  difficulty: number;
}

export default function StatsPage() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();

        if (!json.error && Array.isArray(json)) {
          const formatted: ChartData[] = json.map((item: Stat, index: number) => ({
            id: index + 1,
            session: index + 1,
            topic: item.topic || "General",
            accuracy: item.accuracy ?? 0,
            difficulty:
              item.difficulty === "EASY"
                ? 30
                : item.difficulty === "MEDIUM"
                ? 60
                : 90,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full bg-[var(--background)] py-12 px-6">
      <div className="max-w-[1100px] mx-auto text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--heading)] mt-4 mb-6">
            Your Adaptive Learning Progress
          </h2>
          <p className="text-[var(--paragraph)] max-w-[600px] mx-auto mb-16">
            This chart shows how your accuracy evolves as the AI adapts challenge difficulty over time.
          </p>
        </div>

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
                <XAxis
                  dataKey="session"
                  label={{ value: "Session", position: "insideBottom", offset: -5 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--paragraph)",
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "accuracy"
                      ? "Accuracy"
                      : name === "difficulty"
                      ? "Difficulty"
                      : name,
                  ]}
                  labelFormatter={(label, payload) => {
                    const topic = payload?.[0]?.payload?.topic;
                    return `Session ${label} (${topic})`;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Accuracy"
                />
                <Line
                  type="monotone"
                  dataKey="difficulty"
                  stroke="var(--secondary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Difficulty"
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
