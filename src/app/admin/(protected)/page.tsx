import Link from "next/link";
import type { Metadata } from "next";
import { getOrders, getProducts } from "@/lib/db";
import { totalStock, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function AdminDashboardPage() {
  const products = getProducts();
  const orders = getOrders();

  const totalUnits = products.reduce((sum, p) => sum + totalStock(p), 0);
  const lowStock = products.filter((p) => {
    const stock = totalStock(p);
    return stock > 0 && stock <= 5;
  });
  const outOfStock = products.filter((p) => totalStock(p) === 0);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-medium">Tableau de bord</h1>
        <p className="mt-1 text-sm text-ash">Vue d&apos;ensemble de l&apos;activité MAISON.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Commandes" value={String(orders.length)} />
        <StatCard label="Chiffre d'affaires" value={formatPrice(revenue)} />
        <StatCard label="Produits" value={String(products.length)} />
        <StatCard label="Unités en stock" value={String(totalUnits)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-[11px] uppercase tracking-[0.14em] underline">
              Tout voir
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-ash">Aucune commande pour le moment.</p>
          ) : (
            <div className="mt-4 divide-y divide-line">
              {orders.slice(0, 6).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:opacity-70"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-ash">
                      {order.customer.firstName} {order.customer.lastName} —{" "}
                      {ORDER_STATUS_LABELS[order.status]}
                    </p>
                  </div>
                  <p>{formatPrice(order.total)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Alertes de stock</h2>
            <Link href="/admin/products" className="text-[11px] uppercase tracking-[0.14em] underline">
              Gérer
            </Link>
          </div>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="mt-4 text-sm text-ash">Tous les stocks sont sains.</p>
          ) : (
            <div className="mt-4 divide-y divide-line">
              {outOfStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:opacity-70"
                >
                  <span>{p.name}</span>
                  <span className="text-red-600">Épuisé</span>
                </Link>
              ))}
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:opacity-70"
                >
                  <span>{p.name}</span>
                  <span className="text-ash">{totalStock(p)} restant(s)</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ash">{label}</p>
      <p className="mt-2 text-2xl font-medium">{value}</p>
    </div>
  );
}
