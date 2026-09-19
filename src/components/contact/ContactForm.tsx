"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const SUBJECTS = ["Question produit", "Commande & livraison", "Retours & échanges", "Presse & partenariats", "Autre"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    // No backend is wired up for this mock storefront — the form simply
    // confirms receipt client-side, ready to be pointed at a real endpoint.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-line bg-smoke p-8">
        <p className="font-display text-2xl italic">Message envoyé.</p>
        <p className="mt-3 text-sm text-ash">
          Merci {form.name}, notre équipe vous répondra à {form.email} dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Nom *
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Email *
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
          Sujet
        </span>
        <select
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          className="w-full border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
          Message *
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="w-full border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
        />
      </label>

      <Button type="submit" size="lg">
        Envoyer le message
      </Button>
    </form>
  );
}
