import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/account/actions";
import { getCurrentUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Авторизацияланған зерттеушінің аккаунт беті.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <header className="mb-7">
        <p className="section-kicker">Account</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Зерттеуші профилі</h1>
      </header>

      <section className="max-w-2xl rounded-3xl border border-subtle bg-bg-card/75 p-6">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-text-secondary">Email</dt>
            <dd className="mt-1 text-text-primary">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-text-secondary">User ID</dt>
            <dd className="mt-1 break-all text-text-secondary">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-text-secondary">Тіркелген уақыты</dt>
            <dd className="mt-1 text-text-secondary">{user.created_at ? new Date(user.created_at).toLocaleString("kk-KZ") : "-"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-subtle bg-white/5 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-white/10"
            >
              Шығу
            </button>
          </form>

          <Link href="/search" className="rounded-full bg-accent-primary px-4 py-2 text-sm font-medium text-white">
            Іздеуге өту
          </Link>
        </div>
      </section>
    </div>
  );
}
