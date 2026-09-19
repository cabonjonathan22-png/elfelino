"use client";

import { useState } from "react";
import type { Brand, BrandValue } from "@/lib/types";
import { saveBrandAction } from "@/app/admin/(protected)/brands/actions";
import { CoverImageUploader } from "@/components/admin/CoverImageUploader";

export function BrandForm({ brand }: { brand: Brand }) {
  const [values, setValues] = useState<BrandValue[]>(brand.values);
  const [coverImage, setCoverImage] = useState<string | null>(brand.coverImage ?? null);
  const [saved, setSaved] = useState(false);

  function updateValue(index: number, patch: Partial<BrandValue>) {
    setValues((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function addValue() {
    setValues((prev) => [...prev, { title: "", description: "" }]);
  }

  function removeValue(index: number) {
    setValues((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form
      action={saveBrandAction}
      onSubmit={() => setSaved(true)}
      className="max-w-2xl space-y-8"
    >
      <input type="hidden" name="slug" value={brand.slug} />
      <input type="hidden" name="valuesJson" value={JSON.stringify(values)} />
      <input type="hidden" name="coverImage" value={coverImage ?? ""} />

      <CoverImageUploader
        label="Image de couverture"
        value={coverImage}
        onChange={setCoverImage}
        folder={`brands/${brand.slug}`}
      />

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom affiché" name="name" defaultValue={brand.name} />
        <Field label="Nom court" name="shortName" defaultValue={brand.shortName} />
        <Field label="Tagline" name="tagline" defaultValue={brand.tagline} />
        <Field label="Positionnement" name="positioning" defaultValue={brand.positioning} />
        <Field label="Label du hero" name="heroLabel" defaultValue={brand.heroLabel} />
      </section>

      <TextArea label="Description" name="description" defaultValue={brand.description} rows={3} />
      <TextArea
        label="Récit de marque (un paragraphe par ligne)"
        name="story"
        defaultValue={brand.story.join("\n")}
        rows={6}
      />

      <section>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Valeurs de la marque
          </span>
          <button
            type="button"
            onClick={addValue}
            className="text-[11px] font-medium uppercase tracking-[0.14em] underline"
          >
            + Ajouter une valeur
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {values.map((v, i) => (
            <div key={i} className="grid gap-2 border border-line p-3 sm:grid-cols-[160px_1fr_auto]">
              <input
                value={v.title}
                onChange={(e) => updateValue(i, { title: e.target.value })}
                placeholder="Titre"
                className="border border-mist bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <input
                value={v.description}
                onChange={(e) => updateValue(i, { description: e.target.value })}
                placeholder="Description"
                className="border border-mist bg-white px-2.5 py-2 text-sm focus:border-ink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeValue(i)}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash hover:text-ink"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-graphite"
        >
          Enregistrer
        </button>
        {saved && <span className="text-xs text-ash">Modifications enregistrées.</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <input
        name={name}
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
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="w-full border border-mist bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}
