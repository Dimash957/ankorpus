"use client";

import { toPng } from "html-to-image";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCharacterStats,
  getGenreDistribution,
  getSongLevelMetrics,
  getTimelineDistribution,
  getVerseLengthStats,
  getWordFrequency,
  getWordNgramData,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type TabKey = "general" | "chars" | "words" | "verses" | "songs" | "viz";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "general", label: "Жалпы статистика" },
  { key: "chars", label: "Символдар" },
  { key: "words", label: "Сөздер" },
  { key: "verses", label: "Шумақтар" },
  { key: "songs", label: "Әндер" },
  { key: "viz", label: "Визуализациялар" },
];

const PIE_COLORS = ["#7C6FFF", "#3EC9A7", "#F5A623", "#5DA8FF", "#00BFA6", "#9D6BFF"];

function toCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const values = rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","));
  return [headers.join(","), ...values].join("\n");
}

interface ChartCardProps {
  title: string;
  data: Array<Record<string, string | number>>;
  fileBase: string;
  children: React.ReactNode;
}

interface AnalysisDataPayload {
  wordFrequency: Array<{ word: string; count: number }>;
  genreDistribution: Array<{ genre: string; count: number }>;
  timeline: Array<{ period: string; count: number }>;
  chars: Array<{ label: string; value: number }>;
  ngrams: Array<{ ngram: string; count: number }>;
  verseLengths: Array<{ label: string; count: number }>;
  songMetrics: Array<{ song: string; words: number; unique: number; lines: number; year: number }>;
}

interface AnalysisDashboardProps {
  initialData?: AnalysisDataPayload;
}

function ChartCard({ title, data, fileBase, children }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleExportPng = async () => {
    if (!chartRef.current || !isMounted) {
      return;
    }

    const url = await toPng(chartRef.current, {
      cacheBust: true,
      backgroundColor: "#111118",
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBase}.png`;
    link.click();
  };

  const handleExportCsv = () => {
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileBase}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportPng}
            className="rounded-full border border-subtle bg-white/5 px-3 py-1.5 text-xs text-text-primary transition-colors hover:bg-white/10"
          >
            PNG экспорт
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-full border border-subtle bg-white/5 px-3 py-1.5 text-xs text-text-primary transition-colors hover:bg-white/10"
          >
            CSV экспорт
          </button>
        </div>
      </div>
      <div ref={chartRef} className="h-72 rounded-2xl bg-bg-secondary/50 p-2">
        {isMounted ? (
          children
        ) : (
          <div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
        )}
      </div>
    </article>
  );
}

export function AnalysisDashboard({ initialData }: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const wordFrequency = useMemo(() => initialData?.wordFrequency ?? getWordFrequency(14), [initialData]);
  const genreDistribution = useMemo(() => initialData?.genreDistribution ?? getGenreDistribution(), [initialData]);
  const timeline = useMemo(() => initialData?.timeline ?? getTimelineDistribution(), [initialData]);
  const chars = useMemo(() => initialData?.chars ?? getCharacterStats(), [initialData]);
  const ngrams = useMemo(() => initialData?.ngrams ?? getWordNgramData(), [initialData]);
  const verseLengths = useMemo(() => initialData?.verseLengths ?? getVerseLengthStats(), [initialData]);
  const songMetrics = useMemo(() => initialData?.songMetrics ?? getSongLevelMetrics(), [initialData]);

  const tabContent = () => {
    if (activeTab === "general") {
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Жанр бойынша үлестірім" data={genreDistribution} fileBase="genre-distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genreDistribution} dataKey="count" nameKey="genre" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {genreDistribution.map((entry, index) => (
                    <Cell key={`${entry.genre}-${index + 1}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Уақыт бойындағы өсу" data={timeline} fileBase="timeline-distribution">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fill: "#8888A0", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8888A0", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                />
                <Area type="monotone" dataKey="count" stroke="#3EC9A7" strokeWidth={2} fill="rgba(62,201,167,0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      );
    }

    if (activeTab === "chars") {
      return (
        <ChartCard title="Символдар статистикасы" data={chars} fileBase="character-stats">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chars}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8888A0", fontSize: 12 }} />
              <YAxis tick={{ fill: "#8888A0", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Bar dataKey="value" fill="#F5A623" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      );
    }

    if (activeTab === "words") {
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Ең жиі сөздер" data={wordFrequency} fileBase="word-frequency">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wordFrequency}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="word" tick={{ fill: "#8888A0", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8888A0", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                />
                <Bar dataKey="count" fill="#7C6FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Сөздік N-gram (2-грам)" data={ngrams} fileBase="word-ngrams">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ngrams} layout="vertical" margin={{ left: 18, right: 10, top: 12, bottom: 12 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#8888A0", fontSize: 11 }} />
                <YAxis dataKey="ngram" type="category" width={120} tick={{ fill: "#8888A0", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                />
                <Bar dataKey="count" fill="#3EC9A7" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      );
    }

    if (activeTab === "verses") {
      return (
        <ChartCard title="Шумақ ұзындығы (сөз саны)" data={verseLengths} fileBase="verse-lengths">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={verseLengths}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8888A0", fontSize: 12 }} />
              <YAxis tick={{ fill: "#8888A0", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Bar dataKey="count" fill="#5DA8FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      );
    }

    if (activeTab === "songs") {
      return (
        <ChartCard title="Ән деңгейіндегі метрикалар (сөз/жол)" data={songMetrics} fileBase="song-level-metrics">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={songMetrics} margin={{ left: 8, right: 8, top: 10, bottom: 4 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="song" tick={{ fill: "#8888A0", fontSize: 10 }} interval={0} angle={-16} textAnchor="end" height={56} />
              <YAxis tick={{ fill: "#8888A0", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Area type="monotone" dataKey="words" stroke="#7C6FFF" fill="rgba(124,111,255,0.22)" />
              <Area type="monotone" dataKey="lines" stroke="#3EC9A7" fill="rgba(62,201,167,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      );
    }

    return (
      <ChartCard title="Көпөлшемді жиілік визуалы" data={wordFrequency} fileBase="misc-visualization">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={wordFrequency}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="word" tick={{ fill: "#8888A0", fontSize: 12 }} />
            <YAxis tick={{ fill: "#8888A0", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {wordFrequency.map((entry, index) => (
                <Cell key={`${entry.word}-${index + 1}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-subtle bg-bg-card/55 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key ? "bg-accent-primary text-white" : "text-text-secondary hover:text-text-primary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabContent()}
    </section>
  );
}
