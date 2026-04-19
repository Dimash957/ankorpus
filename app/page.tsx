import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, Sparkles } from "lucide-react";
import { AnalysisPreviewCharts } from "@/components/analysis-preview-charts";
import { AnimatedCounter } from "@/components/animated-counter";
import { ArtistArchiveCard } from "@/components/artist-archive-card";
import { HeroFloatingCards } from "@/components/hero-floating-cards";
import { getLandingDatasetRepository } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Ән мәтіндерінің корпусы",
};

const citationSnippet = `@dataset{ankorpus_2026,
  title={Ән мәтіндерінің корпусы: Қазақ поп музыка мәтіндерінің аннотацияланған корпусы},
  author={Ән мәтіндерінің корпусы зерттеу тобы},
  year={2026},
  url={https://ankorpus.kz}
}`;

export default async function Home() {
  const { artists, thematicArchives, wordFrequency, genreDistribution, timeline } =
    await getLandingDatasetRepository();

  return (
    <div className="pb-16">
      <section className="mesh-bg border-b border-subtle pb-14 pt-14">
        <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.08fr_1fr]">
          <div>
            <p className="section-kicker">Ғылыми платформа · Қаз corpus tech</p>
            <h1 className="max-w-2xl">Ән мәтіндерінің корпусы</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
              15 000+ аннотацияланған мәтін · Ғылыми зерттеу платформасы.
              Қазақ тіліндегі поп музыка лирикасын іздеу, салыстыру және
              статистикалық модельдеу үшін жасалған заманауи интерфейс.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary">
                Корпусты зерттеу <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-ghost">
                Туралы білу
              </Link>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-white/5 px-4 py-2 text-xs text-text-secondary">
              <Sparkles size={14} className="text-accent-secondary" />
              TEI P5 · POS/lemma/NER қабаттары · Instant concordance
            </div>
          </div>

          <HeroFloatingCards />
        </div>
      </section>

      <section className="section-shell -mt-8">
        <div className="grid gap-3 rounded-3xl border border-subtle bg-bg-card/70 p-3 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCounter value={15000} suffix="+" label="мәтін" />
          <AnimatedCounter value={200} suffix="+" label="орындаушы" />
          <AnimatedCounter value={9} label="мұрағат" />
          <AnimatedCounter value={2024} prefix="1967-" label="жылдар" />
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Негізгі қорлар</p>
            <h2 className="section-title">Орындаушылар мұрағаты</h2>
          </div>
          <Link href="/search" className="btn-ghost hidden sm:inline-flex">
            Барлығын көру <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {artists.map((artist) => (
            <ArtistArchiveCard key={artist.slug} artist={artist} />
          ))}
        </div>
      </section>

      <section className="section-shell mt-20">
        <p className="section-kicker">Тақырыптық қорлар</p>
        <h2 className="section-title">Тақырыптық мұрағаттар</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {thematicArchives.map((archive) => (
            <article key={archive.id} className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">{archive.years}</p>
              <h3 className="mt-3 text-lg font-semibold text-text-primary">{archive.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{archive.summary}</p>
              <div className="mt-4 inline-flex rounded-full border border-subtle bg-white/5 px-3 py-1 text-xs text-accent-secondary">
                {archive.countLabel}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-kicker">Интерактив модуль</p>
            <h2 className="section-title">Аналитика</h2>
          </div>
          <Link href="/analysis" className="text-sm font-medium text-accent-secondary hover:text-accent-secondary/80">
            Толық статистиканы қарау →
          </Link>
        </div>

        <AnalysisPreviewCharts
          wordFrequency={wordFrequency}
          genreDistribution={genreDistribution}
          timeline={timeline}
        />
      </section>

      <section className="section-shell mt-20">
        <article className="glass-card overflow-hidden rounded-3xl border border-subtle bg-bg-card/70 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Дәйексөз</p>
              <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">Академиялық сілтеме</h2>
            </div>
            <Database className="text-accent-warm" size={22} />
          </div>

          <pre className="mt-5 overflow-x-auto rounded-2xl border border-subtle bg-bg-secondary/75 p-4 font-mono text-xs leading-6 text-text-primary">
            {citationSnippet}
          </pre>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/citation.bib" download className="btn-primary">
              BibTeX жүктеу
            </a>
            <a href="/citation.ris" download className="btn-ghost">
              RIS жүктеу
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
