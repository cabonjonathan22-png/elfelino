"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PRODUCT_CATEGORY_LABELS,
  type Brand,
  type Product,
  type ProductCategory,
  type ProductSizeStock,
} from "@/lib/types";
import { saveProductAction, deleteProductAction } from "@/app/admin/(protected)/products/actions";

const CATEGORY_ENTRIES = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][];

export function ProductForm({ product, brands }: { product?: Product; brands: Brand[] }) {
  const router = useRouter();
  const [sizes, setSizes] = useState<ProductSizeStock[]>(
    product?.sizes ?? [{ size: "", stock: 0 }]
  );

  function updateSize(index: number, patch: Partial<ProductSizeStock>) {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSize() {
    setSizes((prev) => [...prev, { size: "", stock: 0 }]);
  }

  function removeSize(index: number) {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-2xl space-y-6">
    <form action={saveProductAction} className="space-y-8">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="sizesJson" value={JSON.stringify(sizes)} />

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom *" name="name" defaultValue={product?.name} required />
        <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} placeholder="généré depuis le nom si vide" />

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Marque *
          </span>
          <select
            name="brand"
            defaultValue={product?.brand ?? "el-felino"}
            className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
          >
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Catégorie *
          </span>
          <select
            name="category"
            defaultValue={product?.category ?? "accessoire"}
            className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
          >
            {CATEGORY_ENTRIES.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <Field label="Prix (€) *" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        <Field
          label="Prix barré (€)"
          name="compareAtPrice"
          type="number"
          step="0.01"
          defaultValue={product?.compareAtPrice}
        />
      </section>

      <section className="space-y-5">
        <TextArea label="Description *" name="description" defaultValue={product?.description} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Composition" name="composition" defaultValue={product?.composition} />
          <Field label="Entretien" name="care" defaultValue={product?.care} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Tailles &amp; stock
          </span>
          <button
            type="button"
            onClick={addSize}
            className="text-[11px] font-medium uppercase tracking-[0.14em] underline"
          >
            + Ajouter une taille
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={s.size}
                onChange={(e) => updateSize(i, { size: e.target.value })}
                placeholder="Taille (ex: M)"
                className="w-32 border border-mist bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={s.stock}
                onChange={(e) => updateSize(i, { stock: Number(e.target.value) })}
                placeholder="Stock"
                className="w-32 border border-mist bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Ton du visuel
          </span>
          <select
            name="tone"
            defaultValue={product?.tone ?? "light"}
            className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Variante visuelle (1–6)
          </span>
          <input
            type="number"
            name="swatch"
            min={1}
            max={6}
            defaultValue={product?.swatch ?? 1}
            className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </label>
      </section>

      <section className="flex gap-8">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="h-4 w-4 accent-black" />
          Nouveauté
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isLimited"
            defaultChecked={product?.isLimited}
            className="h-4 w-4 accent-black"
          />
          Édition limitée
        </label>
      </section>

      <div className="flex gap-3 border-t border-line pt-6">
        <button type="submit" className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-graphite">
          {product ? "Enregistrer les modifications" : "Créer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-mist px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] hover:border-ink"
        >
          Annuler
        </button>
      </div>
    </form>

    {product && (
      <form
        action={deleteProductAction}
        onSubmit={(e) => {
          if (!confirm(`Supprimer définitivement « ${product.name} » ?`)) e.preventDefault();
        }}
        className="flex justify-end"
      >
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-600 hover:underline">
          Supprimer ce produit
        </button>
      </form>
    )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <input
        type={type}
        name={name}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        required={required}
        defaultValue={defaultValue}
        className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}
