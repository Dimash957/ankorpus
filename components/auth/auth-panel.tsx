"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "signin" | "signup";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase ортасы бапталмаған. .env файлын толтырыңыз.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }

        setMessage("Сәтті кірдіңіз. Профиль бетіне бағытталасыз...");
        router.push("/account");
        router.refresh();
        return;
      }

      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Тіркелу сәтті. Email расталса, жүйеге кіре аласыз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-subtle bg-bg-card/75 p-6">
      <h1 className="text-2xl font-semibold text-text-primary">{mode === "signin" ? "Жүйеге кіру" : "Тіркелу"}</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Supabase Auth арқылы қауіпсіз аутентификация. Email және пароль қолданылады.
      </p>

      <div className="mt-4 inline-flex rounded-full border border-subtle bg-white/5 p-1 text-xs">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full px-3 py-1.5 ${mode === "signin" ? "bg-accent-primary text-white" : "text-text-secondary"}`}
        >
          Кіру
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full px-3 py-1.5 ${mode === "signup" ? "bg-accent-primary text-white" : "text-text-secondary"}`}
        >
          Тіркелу
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-text-secondary">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-2xl border border-subtle bg-bg-secondary/80 px-4 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent-primary"
            placeholder="researcher@ankorpus.kz"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-text-secondary">Құпиясөз</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-2xl border border-subtle bg-bg-secondary/80 px-4 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent-primary"
            placeholder="Кемінде 8 таңба"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-accent-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-primary/85 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Өңделуде..." : mode === "signin" ? "Кіру" : "Тіркелу"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-accent-secondary">{message}</p> : null}

      <p className="mt-5 text-xs text-text-secondary">
        Кіру сәтті болса, <Link href="/account" className="text-accent-secondary">профиль беті</Link> ашылады.
      </p>
    </section>
  );
}
