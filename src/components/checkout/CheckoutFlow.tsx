"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from "@/data/commerce";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { placeOrderAction } from "@/app/(storefront)/checkout/actions";

type Step = 1 | 2 | 3;

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "France",
  phone: "",
};

const STEP_LABELS: Record<Step, string> = {
  1: "Livraison",
  2: "Expédition",
  3: "Paiement",
};

export function CheckoutFlow() {
  const { items, subtotal, discount, promo, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [info, setInfo] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [methodId, setMethodId] = useState(SHIPPING_METHODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalAfterDiscount = subtotal - discount;
  const shippingCost = useMemo(() => {
    if (totalAfterDiscount >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_METHODS.find((m) => m.id === methodId)?.price ?? 0;
  }, [methodId, totalAfterDiscount]);

  function updateInfo<K extends keyof ShippingInfo>(key: K, value: string) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  function goToStep(next: Step) {
    setFormError(null);

    if (step === 1 && next > 1) {
      const required: (keyof ShippingInfo)[] = [
        "firstName",
        "lastName",
        "email",
        "address",
        "city",
        "postalCode",
      ];
      const missing = required.some((key) => !info[key].trim());
      if (missing) {
        setFormError("Merci de compléter tous les champs obligatoires.");
        return;
      }
    }

    if (step === 3 && paymentMethod === "card") {
      const missing = !card.name.trim() || !card.number.trim() || !card.expiry.trim() || !card.cvc.trim();
      if (missing && next !== step) {
        setFormError("Merci de compléter les informations de carte.");
        return;
      }
    }

    setStep(next);
  }

  async function handleConfirmOrder() {
    if (paymentMethod === "card") {
      const missing = !card.name.trim() || !card.number.trim() || !card.expiry.trim() || !card.cvc.trim();
      if (missing) {
        setFormError("Merci de compléter les informations de carte.");
        return;
      }
    }

    // No real payment processor is wired up — this mock flow records the
    // order through a server action (persisted, stock decremented, visible
    // in the admin) so the tunnel is fully functional, ready to be swapped
    // for a real Stripe/PayPal confirmation call.
    setSubmitting(true);
    setFormError(null);
    try {
      const { id } = await placeOrderAction({
        customer: info,
        items,
        shippingMethodId: methodId,
        shippingCost,
        paymentMethod,
        promoCode: promo?.code,
        subtotal,
        discount,
        total: Math.max(subtotal - discount, 0) + shippingCost,
      });
      setOrderId(id);
      clearCart();
    } catch {
      setFormError("Une erreur est survenue lors de la validation de la commande.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-ash">
          Commande confirmée
        </p>
        <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">Merci, {info.firstName}.</h1>
        <p className="mt-4 max-w-md text-sm text-ash">
          Votre commande <span className="font-medium text-ink">{orderId}</span> a bien été
          enregistrée. Un email de confirmation vous sera envoyé à {info.email}.
        </p>
        <Button href="/shop" className="mt-8" size="lg">
          Continuer mes achats
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-sm text-ash">Votre panier est vide.</p>
        <Button href="/shop" className="mt-6" size="lg">
          Découvrir la boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="mb-10 flex items-center gap-4">
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => s < step && goToStep(s)}
                className={cn(
                  "flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em]",
                  s === step ? "text-ink" : s < step ? "text-ink/60" : "text-ash/50"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                    s <= step ? "border-ink bg-ink text-white" : "border-mist"
                  )}
                >
                  {s}
                </span>
                {STEP_LABELS[s]}
              </button>
              {i < 2 && <span className="h-px w-8 bg-line" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prénom *" value={info.firstName} onChange={(v) => updateInfo("firstName", v)} />
              <Field label="Nom *" value={info.lastName} onChange={(v) => updateInfo("lastName", v)} />
            </div>
            <Field
              label="Email *"
              type="email"
              value={info.email}
              onChange={(v) => updateInfo("email", v)}
            />
            <Field label="Téléphone" type="tel" value={info.phone} onChange={(v) => updateInfo("phone", v)} />
            <Field label="Adresse *" value={info.address} onChange={(v) => updateInfo("address", v)} />
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Ville *" value={info.city} onChange={(v) => updateInfo("city", v)} />
              <Field
                label="Code postal *"
                value={info.postalCode}
                onChange={(v) => updateInfo("postalCode", v)}
              />
              <Field label="Pays" value={info.country} onChange={(v) => updateInfo("country", v)} />
            </div>

            {formError && <p className="text-xs text-red-600">{formError}</p>}

            <Button size="lg" className="w-full sm:w-auto" onClick={() => goToStep(2)}>
              Continuer vers l&apos;expédition
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {totalAfterDiscount >= FREE_SHIPPING_THRESHOLD && (
              <p className="border border-ink/10 bg-smoke px-4 py-3 text-xs">
                Livraison offerte débloquée sur cette commande.
              </p>
            )}
            {SHIPPING_METHODS.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between border px-5 py-4",
                  methodId === method.id ? "border-ink" : "border-mist"
                )}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="shipping"
                    checked={methodId === method.id}
                    onChange={() => setMethodId(method.id)}
                    className="h-4 w-4 accent-black"
                  />
                  <div>
                    <p className="text-sm font-medium">{method.label}</p>
                    <p className="text-xs text-ash">{method.description}</p>
                  </div>
                </div>
                <span className="text-sm">
                  {totalAfterDiscount >= FREE_SHIPPING_THRESHOLD || method.price === 0
                    ? "Gratuit"
                    : formatPrice(method.price)}
                </span>
              </label>
            ))}

            <div className="flex gap-4 pt-2">
              <Button variant="secondary" size="lg" onClick={() => goToStep(1)}>
                Retour
              </Button>
              <Button size="lg" onClick={() => goToStep(3)}>
                Continuer vers le paiement
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex-1 border px-5 py-4 text-sm font-medium",
                  paymentMethod === "card" ? "border-ink bg-ink text-white" : "border-mist"
                )}
              >
                Carte bancaire
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={cn(
                  "flex-1 border px-5 py-4 text-sm font-medium",
                  paymentMethod === "paypal" ? "border-ink bg-ink text-white" : "border-mist"
                )}
              >
                PayPal
              </button>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-5">
                <Field
                  label="Nom sur la carte *"
                  value={card.name}
                  onChange={(v) => setCard((p) => ({ ...p, name: v }))}
                />
                <Field
                  label="Numéro de carte *"
                  value={card.number}
                  onChange={(v) => setCard((p) => ({ ...p, number: v }))}
                  placeholder="•••• •••• •••• ••••"
                />
                <div className="grid grid-cols-2 gap-5">
                  <Field
                    label="Expiration *"
                    value={card.expiry}
                    onChange={(v) => setCard((p) => ({ ...p, expiry: v }))}
                    placeholder="MM/AA"
                  />
                  <Field
                    label="CVC *"
                    value={card.cvc}
                    onChange={(v) => setCard((p) => ({ ...p, cvc: v }))}
                    placeholder="•••"
                  />
                </div>
                <p className="text-[11px] text-ash">
                  Paiement sécurisé — structure prête pour l&apos;intégration Stripe. Aucune
                  transaction réelle n&apos;est effectuée dans cette démonstration.
                </p>
              </div>
            ) : (
              <p className="border border-mist px-5 py-6 text-sm text-ash">
                Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.
                (Intégration PayPal prête à être branchée.)
              </p>
            )}

            {formError && <p className="text-xs text-red-600">{formError}</p>}

            <div className="flex gap-4 pt-2">
              <Button variant="secondary" size="lg" onClick={() => goToStep(2)}>
                Retour
              </Button>
              <Button size="lg" onClick={handleConfirmOrder} disabled={submitting}>
                {submitting ? "Validation en cours…" : "Confirmer la commande"}
              </Button>
            </div>
          </div>
        )}

        <p className="mt-10 text-[11px] text-ash">
          Besoin d&apos;aide ?{" "}
          <Link href="/contact" className="underline">
            Contactez la Maison
          </Link>
        </p>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary shippingCost={shippingCost} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-mist bg-white px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}
