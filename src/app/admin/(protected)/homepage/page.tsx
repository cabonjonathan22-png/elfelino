import type { Metadata } from "next";
import { getHomeContent } from "@/lib/db";
import { HomeContentForm } from "@/components/admin/HomeContentForm";

export const metadata: Metadata = { title: "Page d'accueil" };

export default async function AdminHomepagePage() {
  const content = await getHomeContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Page d&apos;accueil</h1>
        <p className="mt-1 text-sm text-ash">
          Gère les photos affichées sur la page d&apos;accueil du site.
        </p>
      </div>
      <HomeContentForm content={content} />
    </div>
  );
}
