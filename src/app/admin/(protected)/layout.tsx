import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { getAccessCodeById } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/admin/login/actions";

export default async function AdminProtectedLayout({ children }: LayoutProps<"/admin">) {
  const store = await cookies();
  const accessCodeId = await verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
  const accessCode = accessCodeId ? getAccessCodeById(accessCodeId) : undefined;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-white p-5 lg:block">
        <Link href="/admin" className="font-display text-lg italic">
          MAISON
        </Link>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ash">Admin</p>

        <div className="mt-8">
          <AdminSidebar />
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4 lg:px-8">
          <Link href="/admin" className="font-display text-base italic lg:hidden">
            MAISON Admin
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
            >
              Voir le site ↗
            </Link>
            {accessCode && (
              <span className="text-[11px] text-ash">
                Connecté — <span className="text-ink">{accessCode.label}</span>
              </span>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
