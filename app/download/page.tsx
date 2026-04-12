import type { Metadata } from "next";
import { Download, FileCode2, FileJson2, FileSpreadsheet, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Жүктеу",
  description: "Корпус деректерін XML, JSON, CSV және CoNLL-U форматында жүктеу орталығы.",
};

const downloadItems = [
  {
    title: "XML TEI P5",
    description: "Құрылымдалған бастапқы формат. div1, lg, l және толық лингвистикалық атрибуттар.",
    file: "ankorpus-tei.xml",
    icon: FileCode2,
    count: "12 842 жүктеу",
  },
  {
    title: "JSON (derived)",
    description: "Зерттеу сценарийлеріне ыңғайлы нормаланған JSON құрылымы.",
    file: "ankorpus-derived.json",
    icon: FileJson2,
    count: "9 210 жүктеу",
  },
  {
    title: "CSV (lemmatized)",
    description: "Лемма, орындаушы, жыл және жанр бағандары бар талдау кестесі.",
    file: "ankorpus-lemmas.csv",
    icon: FileSpreadsheet,
    count: "7 934 жүктеу",
  },
  {
    title: "CoNLL-U (POS annotated)",
    description: "POS аннотациясы бар токендік корпус, NLP pipeline үшін дайын.",
    file: "ankorpus-pos.conllu",
    icon: FileCode2,
    count: "6 488 жүктеу",
  },
];

const usageStats = [
  { label: "Жалпы жүктеу", value: "36 474" },
  { label: "Соңғы 30 күн", value: "4 091" },
  { label: "API сұраулар", value: "118 322" },
];

export default function DownloadPage() {
  return (
    <div className="section-shell py-10 sm:py-14">
      <header className="mb-8">
        <p className="section-kicker">Data Delivery</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Жүктеу орталығы</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
          Корпус деректерін түрлі форматта жүктеп, өз зерттеу құралыңызға тікелей кірістіріңіз.
        </p>
      </header>

      <section className="mb-6 rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-white/5 px-4 py-2 text-sm text-text-primary">
          <ShieldCheck size={16} className="text-accent-secondary" />
          Лицензия: CC BY-NC 4.0
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {downloadItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-accent-primary">
                <Icon size={20} />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-text-secondary">{item.description}</p>
              <p className="mt-3 text-xs text-text-secondary">{item.count}</p>
              <a
                href={`/${item.file}`}
                download
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary/85"
              >
                <Download size={15} />
                {item.file}
              </a>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {usageStats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-subtle bg-bg-card/65 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{stat.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
