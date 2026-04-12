import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-14 text-center">
      <p className="section-kicker">404</p>
      <h1 className="text-4xl font-semibold text-text-primary sm:text-5xl">Бет табылмады</h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Сұралған ресурс қолжетімсіз немесе мекенжай өзгерген. Негізгі іздеу бетіне оралып көріңіз.
      </p>
      <Link href="/search" className="btn-primary mt-7">
        Іздеу бетіне өту
      </Link>
    </div>
  );
}
