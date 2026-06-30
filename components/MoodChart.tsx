"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { moodToScore } from "@/lib/moodScore";

type Entry = {
  date: string;
  mood: string;
};

export default function MoodChart({ entries }: { entries: Entry[] }) {
  // Reverse so chart reads oldest → newest, left to right
  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: e.date.slice(5), // show MM-DD only
      score: moodToScore(e.mood),
      mood: e.mood,
    }));

  if (chartData.length < 2) {
    return (
      <p className="text-muted text-sm mb-6">
        Write a few more entries to see your mood trend here.
      </p>
    );
  }

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 mb-6">
      <p className="text-amber text-xs font-medium tracking-wide uppercase mb-4">
        Mood Trend
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#8C8898"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#8C8898"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={20}
          />
          <Tooltip
            contentStyle={{
              background: "#211F2B",
              border: "1px solid #ffffff20",
              borderRadius: "8px",
              color: "#F2EEE6",
            }}
            formatter={(_value, _name, props) => [props.payload.mood, "Mood"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#E8A65C"
            strokeWidth={2}
            dot={{ fill: "#E8A65C", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}