import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Аутентификация",
  description: "Supabase Auth арқылы кіру және тіркелу беті.",
};

export default function AuthPage() {
  return (
    <div className="section-shell py-12 sm:py-16">
      <header className="mb-7 text-center">
        <p className="section-kicker">Authentication</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Қауіпсіз кіру</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
          Бұл бөлімде зерттеуші аккаунтын тіркеп, API арқылы қорғалған backend әрекеттерін қолдана аласыз.
        </p>
      </header>

      <AuthPanel />
    </div>
  );
}
