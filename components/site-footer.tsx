import Link from "next/link";

const citation = `@dataset{ankorpus_2026,
  title={Ән мәтіндерінің корпусы: Қазақ поп музыка мәтіндерінің аннотацияланған корпусы},
  author={Ән мәтіндерінің корпусы зерттеу тобы},
  year={2026},
  url={https://ankorpus.kz}
}`;

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle bg-bg-secondary/80 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">Жоба туралы</h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">
            «Ән мәтіндерінің корпусы» - қазақ тіліндегі поп музыка мәтіндерін лингвистикалық зерттеуге
            арналған ашық ғылыми платформа.
          </p>
          <div className="mt-6 inline-flex items-center rounded-full border border-subtle bg-white/5 px-4 py-2 text-xs font-medium text-text-primary">
            ISLRN: 458-912-771-064-6
          </div>
          <p className="mt-4 text-xs text-text-secondary">Абай атындағы ҚазҰПУ · Қолданбалы лингвистика зертханасы</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">Сілтемелер</h2>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            <li>
              <Link href="/search" className="transition-colors hover:text-text-primary">
                Іздеу интерфейсі
              </Link>
            </li>
            <li>
              <Link href="/analysis" className="transition-colors hover:text-text-primary">
                Статистикалық панель
              </Link>
            </li>
            <li>
              <Link href="/download" className="transition-colors hover:text-text-primary">
                Корпус жүктеулері
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-text-primary">
                Құжаттама
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">Дәйексөз</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-subtle bg-bg-card/70 p-4 font-mono text-xs leading-6 text-text-primary">
            {citation}
          </pre>
          <div className="mt-4 flex gap-3 text-xs">
            <a
              className="rounded-full border border-subtle bg-white/5 px-4 py-2 text-text-primary transition-colors hover:bg-white/10"
              href="/citation.bib"
              download
            >
              BibTeX
            </a>
            <a
              className="rounded-full border border-subtle bg-white/5 px-4 py-2 text-text-primary transition-colors hover:bg-white/10"
              href="/citation.ris"
              download
            >
              RIS
            </a>
          </div>
        </section>
      </div>
      <div className="border-t border-subtle py-4 text-center text-xs text-text-secondary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span>© 2026 Ән мәтіндерінің корпусы</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-text-primary">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-text-primary">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
