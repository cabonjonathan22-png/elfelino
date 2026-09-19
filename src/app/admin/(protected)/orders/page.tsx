import Link from "next/link";
import type { Metadata } from "next";
import { getOrders } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export const metadata: Metadata = { title: "Commandes" };

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Commandes</h1>
        <p className="mt-1 text-sm text-ash">{orders.length} commande(s) enregistrée(s).</p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-line bg-white p-8 text-sm text-ash">
          Aucune commande n&apos;a encore été passée sur le site.
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.12em] text-ash">
                <th className="px-4 py-3 font-medium">Commande</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-ash">
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td className="px-4 py-3 text-ash">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">{ORDER_STATUS_LABELS[order.status]}</td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[11px] font-medium uppercase tracking-[0.14em] underline"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
