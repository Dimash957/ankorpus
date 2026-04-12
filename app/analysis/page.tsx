import type { Metadata } from "next";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { getAnalysisDatasetRepository } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Аналитика",
  description: "Корпус бойынша жиілік, құрылым және уақыттық үлестірімдерді интерактив талдау.",
};

export default async function AnalysisPage() {
  const analysisData = await getAnalysisDatasetRepository();

  return (
    <div className="section-shell py-10 sm:py-14">
      <header className="mb-8">
        <p className="section-kicker">Dashboard</p>
        <h1 className="max-w-4xl text-4xl font-semibold sm:text-5xl">Статистикалық талдау панелі</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
          Барлық диаграммалар интерактивті және PNG/CSV форматында экспортталады.
          Табтар арасында ауысып, сөздік, шумақтық және ән деңгейіндегі көрсеткіштерді салыстырыңыз.
        </p>
      </header>

      <AnalysisDashboard initialData={analysisData} />
    </div>
  );
}
