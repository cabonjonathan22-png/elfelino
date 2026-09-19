import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { updateOrderStatusAction } from "@/app/admin/(protected)/orders/actions";

export const metadata: Metadata = { title: "Détail de la commande" };

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-medium">{order.id}</h1>
        <p className="mt-1 text-sm text-ash">
          Passée le {new Date(order.createdAt).toLocaleString("fr-FR")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-line bg-white p-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ash">Client</h2>
          <p className="mt-3 text-sm leading-relaxed">
            {order.customer.firstName} {order.customer.lastName}
            <br />
            {order.customer.email}
            <br />
            {order.customer.phone}
            <br />
            {order.customer.address}
            <br />
            {order.customer.postalCode} {order.customer.city}, {order.customer.country}
          </p>
        </div>

        <div className="border border-line bg-white p-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ash">Statut</h2>
          <form action={updateOrderStatusAction} className="mt-3 flex gap-3">
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              className="flex-1 border border-mist bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-ink px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-graphite"
            >
              Mettre à jour
            </button>
          </form>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-ash">
              <dt>Paiement</dt>
              <dd className="text-ink">{order.paymentMethod === "card" ? "Carte bancaire" : "PayPal"}</dd>
            </div>
            {order.promoCode && (
              <div className="flex justify-between text-ash">
                <dt>Code promo</dt>
                <dd className="text-ink">{order.promoCode}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="border border-line bg-white p-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ash">Articles</h2>
        <div className="mt-4 divide-y divide-line text-sm">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-ash">
                  Taille {item.size} × {item.quantity}
                </p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-ash">
            <span>Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-ink">
              <span>Réduction</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ash">
            <span>Livraison</span>
            <span>{order.shippingCost === 0 ? "Offerte" : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
