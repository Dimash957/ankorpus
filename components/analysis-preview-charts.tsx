"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

interface AnalysisPreviewChartsProps {
  wordFrequency: Array<{ word: string; count: number }>;
  genreDistribution: Array<{ genre: string; count: number }>;
  timeline: Array<{ period: string; count: number }>;
}

const PIE_COLORS = ["#7C6FFF", "#3EC9A7", "#F5A623", "#568BFF", "#9B5DE5", "#1EB980"];

export function AnalysisPreviewCharts({ wordFrequency, genreDistribution, timeline }: AnalysisPreviewChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <article
            key={item}
            className="glass-card h-60 animate-pulse rounded-3xl border border-subtle bg-bg-card/70"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4">
        <h3 className="mb-3 text-sm font-medium text-text-primary">Сөз жиілігі</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wordFrequency}>
              <XAxis dataKey="word" tick={{ fill: "#8888A0", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Bar dataKey="count" fill="#7C6FFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4">
        <h3 className="mb-3 text-sm font-medium text-text-primary">Жанр үлесі</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={genreDistribution} dataKey="count" nameKey="genre" innerRadius={42} outerRadius={72} paddingAngle={3}>
                {genreDistribution.map((entry, index) => (
                  <Cell key={`${entry.genre}-${index + 1}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4">
        <h3 className="mb-3 text-sm font-medium text-text-primary">Уақыт шкаласы</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline}>
              <XAxis dataKey="period" tick={{ fill: "#8888A0", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Area type="monotone" dataKey="count" stroke="#3EC9A7" fill="rgba(62,201,167,0.22)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
