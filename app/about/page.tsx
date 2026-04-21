import type { Metadata } from "next";
import { XMLParser } from "fast-xml-parser";
import { buildTeiXml, getArtistName, songs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Туралы",
  description: "Жоба сипаттамасы, жарияланымдар, конференциялар және корпус форматы құжаттамасы.",
};

const team = [
  "Жоба жетекшісі Ермекова Тыныштық Нұрдәулетқызы",
  "Алшынова Гүлзия Сәкенқызы",
  "Тазабек Мөлдір",
  "Тілеулинова Жұлдыз",
];

const publications = [
  {
    title: "Қазақ ән мәтіндерінің лексикалық динамикасы (1967-2024)",
    venue: "Қолданбалы лингвистика журналы, 2025",
  },
  {
    title: "TEI P5 негізіндегі қазақ ән мәтіндерін белгілеу стандарты",
    venue: "Digital Humanities Qazaqstan, 2024",
  },
  {
    title: "Kazakh Lyrics Corpus: Concordance және Collocate моделі",
    venue: "NLP Eurasia Workshop, 2026",
  },
];

const talks = [
  { year: "2023", event: "QazaqNLP Meetup", topic: "Қазақ ән мәтіндеріне POS таңбалау" },
  { year: "2024", event: "Digital Humanities Forum", topic: "TEI P5 корпус архитектурасы" },
  { year: "2025", event: "Turkic Language Tech Summit", topic: "Collocation-driven lyrics analysis" },
  { year: "2026", event: "Corpus Linguistics Asia", topic: "Kazakh Song Lyrics Corpus 7.0" },
];

const media = ["Qazaq Science", "Bilim Portal", "EduTimes", "LingvoLab", "DataWeek", "Open Corpus Hub"];

const releaseHistory = [
  { version: "1.0", year: "2018", note: "Бастапқы 1 200 мәтін, қолмен тегтеу" },
  { version: "2.0", year: "2019", note: "TEI құрылымы және метадерек схемасы" },
  { version: "3.0", year: "2020", note: "POS қабаты, genre labels енгізілді" },
  { version: "4.0", year: "2021", note: "Lemma нормализациясы және KWIC индексі" },
  { version: "5.0", year: "2022", note: "Named entities және collocate модулі" },
  { version: "6.0", year: "2024", note: "XML/JSON/CoNLL-U жүктеу арналары" },
  { version: "7.0", year: "2026", note: "SaaS интерфейс, realtime аналитика" },
];

export default function AboutPage() {
  const sampleSong = songs[0];
  const teiSample = buildTeiXml(sampleSong, getArtistName(sampleSong.artistSlug));
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
  });
  const parsed = parser.parse(teiSample) as Record<string, unknown>;
  const rootKey = Object.keys(parsed)[0];
  const rootNode = (parsed[rootKey] ?? {}) as Record<string, unknown>;
  const header = (rootNode.teiHeader ?? {}) as Record<string, unknown>;
  const headerFields = Object.keys(header);

  return (
    <div className="section-shell py-10 sm:py-14">
      <header className="mb-8">
        <p className="section-kicker">Project & Documentation</p>
        <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">Жоба туралы және ғылыми құжаттама</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
          Платформа академиялық сапа талаптарына сай құрылған: дереккөз мөлдірлігі, аннотация
          хаттамасы, қайта өндіруге болатын талдау сценарийлері және нұсқаланған релиз циклі.
        </p>
      </header>

      <section className="mb-8 rounded-3xl border border-subtle bg-bg-card/70 p-6">
        <h2 className="text-2xl font-semibold text-text-primary">Жоба сипаттамасы</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-text-secondary">
          «Ән мәтіндерінің корпусы» қазақ тіліндегі поп, дәстүрлі және эстрадалық ән мәтіндерін зерттеуге арналған лингвистикалық
          инфрақұрылым. Негізгі мақсат: сөзжасам, стильдік динамика, жанрлық айырмашылық және
          уақыттық өзгерістерді бір ортада талдау.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Авторлар</h2>
        <ul className="space-y-3 rounded-3xl border border-subtle bg-bg-card/70 p-5 text-sm text-text-primary">
          {team.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-subtle bg-bg-card/70 p-5">
          <h2 className="text-xl font-semibold text-text-primary">Жарияланымдар</h2>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            {publications.map((item) => (
              <li key={item.title} className="rounded-2xl border border-subtle bg-white/5 p-3">
                <p className="font-medium text-text-primary">{item.title}</p>
                <p className="mt-1">{item.venue}</p>
                <a href="#" className="mt-2 inline-block text-xs text-accent-secondary hover:text-accent-secondary/80">
                  PDF ашу
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-subtle bg-bg-card/70 p-5">
          <h2 className="text-xl font-semibold text-text-primary">Конференция баяндамалары</h2>
          <div className="mt-4 space-y-3">
            {talks.map((talk) => (
              <div key={`${talk.year}-${talk.event}`} className="rounded-2xl border border-subtle bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">{talk.year}</p>
                <p className="mt-1 text-sm font-medium text-text-primary">{talk.event}</p>
                <p className="text-sm text-text-secondary">{talk.topic}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-8 rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <h2 className="text-xl font-semibold text-text-primary">Медиада жарияланым</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {media.map((logo) => (
            <div
              key={logo}
              className="inline-flex items-center justify-center rounded-2xl border border-subtle bg-white/5 px-3 py-4 text-xs text-text-secondary"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <h2 className="text-2xl font-semibold text-text-primary">Корпус форматы: TEI P5 XML</h2>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          Header өрістері: titleStmt, author, date, genre labels, chartsrank. Body құрылымы:
          div1 &gt; lg (chorus/verse/bridge) &gt; l элементтері. Аннотация қабаттары:
          @xml:lang, lemma, pos (STTS негізінде бейімделген), named entities.
        </p>

        <div className="mt-5 rounded-2xl border border-subtle bg-bg-secondary/80 p-4 font-mono text-xs leading-6 text-text-primary">
          <p>
            <span className="text-accent-secondary">&lt;teiHeader&gt;</span> өрістері: {headerFields.join(", ")}
          </p>
          <pre className="mt-3 overflow-x-auto text-[11px] leading-6">
            <span className="text-accent-secondary">&lt;TEI</span> <span className="text-accent-warm">xml:lang</span>=<span className="text-accent-primary">&quot;kk&quot;</span><span className="text-accent-secondary">&gt;</span>{"\n"}
            {"  "}<span className="text-accent-secondary">&lt;teiHeader&gt;</span>{"\n"}
            {"    "}<span className="text-accent-secondary">&lt;titleStmt&gt;</span>{"\n"}
            {"      "}<span className="text-accent-secondary">&lt;title&gt;</span>{sampleSong.title}<span className="text-accent-secondary">&lt;/title&gt;</span>{"\n"}
            {"      "}<span className="text-accent-secondary">&lt;author&gt;</span>{getArtistName(sampleSong.artistSlug)}<span className="text-accent-secondary">&lt;/author&gt;</span>{"\n"}
            {"    "}<span className="text-accent-secondary">&lt;/titleStmt&gt;</span>{"\n"}
            {"    "}<span className="text-accent-secondary">&lt;sourceDesc&gt;&lt;date when=</span><span className="text-accent-primary">&quot;{sampleSong.year}&quot;</span><span className="text-accent-secondary">/&gt;&lt;/sourceDesc&gt;</span>{"\n"}
            {"  "}<span className="text-accent-secondary">&lt;/teiHeader&gt;</span>{"\n"}
            {"  "}<span className="text-accent-secondary">&lt;text&gt;&lt;body&gt;&lt;div1&gt;</span>{"\n"}
            {"    "}<span className="text-accent-secondary">&lt;lg type=</span><span className="text-accent-primary">&quot;verse&quot;</span><span className="text-accent-secondary">&gt;</span>{"\n"}
            {"      "}<span className="text-accent-secondary">&lt;l&gt;&lt;w lemma=</span><span className="text-accent-primary">&quot;қала&quot;</span><span className="text-accent-secondary"> pos=</span><span className="text-accent-primary">&quot;NOUN&quot;</span><span className="text-accent-secondary"> ne=</span><span className="text-accent-primary">&quot;LOC&quot;</span><span className="text-accent-secondary">&gt;</span>Қала<span className="text-accent-secondary">&lt;/w&gt; ... &lt;/l&gt;</span>{"\n"}
            {"    "}<span className="text-accent-secondary">&lt;/lg&gt;</span>{"\n"}
            {"  "}<span className="text-accent-secondary">&lt;/div1&gt;&lt;/body&gt;&lt;/text&gt;</span>{"\n"}
            <span className="text-accent-secondary">&lt;/TEI&gt;</span>
          </pre>
        </div>

        <details className="mt-4 rounded-2xl border border-subtle bg-white/5 p-3 text-xs text-text-secondary">
          <summary className="cursor-pointer text-text-primary">Толық үлгі XML (қысқартылған)</summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap leading-6">{teiSample.slice(0, 1800)}...</pre>
        </details>
      </section>

      <section className="rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <h2 className="text-2xl font-semibold text-text-primary">Release тарихы</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-subtle">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/5 text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Нұсқа</th>
                <th className="px-4 py-3 font-medium">Жыл</th>
                <th className="px-4 py-3 font-medium">Өзгеріс</th>
              </tr>
            </thead>
            <tbody>
              {releaseHistory.map((entry) => (
                <tr key={entry.version} className="border-t border-subtle/70 text-text-primary">
                  <td className="px-4 py-3">{entry.version}</td>
                  <td className="px-4 py-3 text-text-secondary">{entry.year}</td>
                  <td className="px-4 py-3 text-text-secondary">{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
