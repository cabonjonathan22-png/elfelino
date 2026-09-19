import type { Metadata } from "next";
import { getAccessCodes } from "@/lib/db";
import { createAccessCodeAction, revokeAccessCodeAction } from "@/app/admin/(protected)/access-codes/actions";

export const metadata: Metadata = { title: "Codes d'accès" };

export default async function AdminAccessCodesPage() {
  const codes = await getAccessCodes();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-medium">Codes d&apos;accès</h1>
        <p className="mt-1 text-sm text-ash">
          Chaque code permet de se connecter à l&apos;espace d&apos;administration. Révoquez un code
          pour couper immédiatement son accès.
        </p>
      </div>

      <div className="divide-y divide-line border border-line bg-white">
        {codes.map((code) => (
          <div key={code.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium">
                {code.label}{" "}
                {code.revoked && (
                  <span className="ml-2 text-[10px] font-normal uppercase tracking-[0.12em] text-red-600">
                    Révoqué
                  </span>
                )}
              </p>
              <p className="mt-1 font-mono text-xs text-ash">{code.code}</p>
              <p className="mt-1 text-[11px] text-ash">
                Créé le {new Date(code.createdAt).toLocaleDateString("fr-FR")}
                {code.lastUsedAt &&
                  ` — dernière utilisation le ${new Date(code.lastUsedAt).toLocaleDateString("fr-FR")}`}
              </p>
            </div>
            {!code.revoked && (
              <form action={revokeAccessCodeAction}>
                <input type="hidden" name="id" value={code.id} />
                <button
                  type="submit"
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-600 hover:underline"
                >
                  Révoquer
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium">Générer un nouveau code</h2>
        <form action={createAccessCodeAction} className="mt-3 flex gap-3">
          <input
            name="label"
            required
            placeholder="Ex : Responsable boutique"
            className="flex-1 border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-graphite"
          >
            Générer
          </button>
        </form>
      </div>
    </div>
  );
}
