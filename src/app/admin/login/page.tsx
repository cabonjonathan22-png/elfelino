import type { Metadata } from "next";
import { loginAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "Connexion",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl italic text-white">MAISON</p>
        <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-white/50">
          Espace d&apos;administration
        </p>

        <form action={loginAction} className="mt-10 space-y-4">
          <input type="hidden" name="next" value={next || "/admin"} />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
              Code d&apos;accès
            </span>
            <input
              type="password"
              name="code"
              required
              autoFocus
              placeholder="MAISON-XXXXXXXX"
              className="w-full border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm uppercase text-white placeholder:text-white/30 focus:border-white/60 focus:outline-none"
            />
          </label>

          {error && (
            <p className="text-xs text-red-400">Code d&apos;accès invalide ou révoqué.</p>
          )}

          <button
            type="submit"
            className="w-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink hover:bg-white/90"
          >
            Accéder à l&apos;administration
          </button>
        </form>
      </div>
    </div>
  );
}
