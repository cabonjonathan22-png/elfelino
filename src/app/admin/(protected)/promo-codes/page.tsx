import type { Metadata } from "next";
import { getPromoCodes } from "@/lib/db";
import { savePromoCodeAction, deletePromoCodeAction } from "@/app/admin/(protected)/promo-codes/actions";

export const metadata: Metadata = { title: "Codes Promo" };

export default async function AdminPromoCodesPage() {
  const promoCodes = await getPromoCodes();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-medium">Codes Promo</h1>
        <p className="mt-1 text-sm text-ash">
          Ces codes sont utilisables immédiatement dans le panier et au tunnel de commande.
        </p>
      </div>

      <div className="space-y-4">
        {promoCodes.map((promo) => (
          <form
            key={promo.code}
            action={savePromoCodeAction}
            className="grid grid-cols-2 gap-3 border border-line bg-white p-4 sm:grid-cols-5 sm:items-end"
          >
            <input type="hidden" name="previousCode" value={promo.code} />
            <label className="block text-sm">
              <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Code</span>
              <input
                name="code"
                defaultValue={promo.code}
                className="w-full border border-mist px-2.5 py-2 text-sm uppercase focus:border-ink focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Type</span>
              <select
                name="type"
                defaultValue={promo.type}
                className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
              >
                <option value="percent">Pourcentage</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Valeur</span>
              <input
                type="number"
                name="value"
                defaultValue={promo.value}
                className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </label>
            <label className="col-span-2 block text-sm sm:col-span-1">
              <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Description</span>
              <input
                name="description"
                defaultValue={promo.description}
                className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-ink px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white hover:bg-graphite"
              >
                Enregistrer
              </button>
              <button
                type="submit"
                formAction={deletePromoCodeAction}
                formNoValidate
                className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-red-600 hover:underline"
              >
                Suppr.
              </button>
            </div>
          </form>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium">Ajouter un code</h2>
        <form
          action={savePromoCodeAction}
          className="mt-3 grid grid-cols-2 gap-3 border border-dashed border-mist p-4 sm:grid-cols-5 sm:items-end"
        >
          <label className="block text-sm">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Code</span>
            <input
              name="code"
              required
              placeholder="ETE2026"
              className="w-full border border-mist px-2.5 py-2 text-sm uppercase focus:border-ink focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Type</span>
            <select
              name="type"
              defaultValue="percent"
              className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
            >
              <option value="percent">Pourcentage</option>
              <option value="fixed">Montant fixe (€)</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Valeur</span>
            <input
              type="number"
              name="value"
              defaultValue={10}
              className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </label>
          <label className="col-span-2 block text-sm sm:col-span-1">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-ash">Description</span>
            <input
              name="description"
              placeholder="Offre d'été"
              className="w-full border border-mist px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="bg-ink px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white hover:bg-graphite"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
}
