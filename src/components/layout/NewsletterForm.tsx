"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return <p className="mt-4 text-sm text-ink">Merci — vous êtes inscrit(e).</p>;
  }

  return (
    <form
      className="mt-4 flex border-b border-ink pb-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="Votre email"
        className="w-full bg-transparent text-sm placeholder:text-ash focus:outline-none"
      />
      <button type="submit" className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em]">
        OK
      </button>
    </form>
  );
}
