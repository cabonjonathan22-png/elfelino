import type { PromoCode, ShippingMethod } from "@/lib/types";

// Mock promo codes — validated client-side against this list.
export const PROMO_CODES: PromoCode[] = [
  { code: "MAISON10", type: "percent", value: 10, description: "10% sur toute la commande" },
  { code: "WELCOME15", type: "percent", value: 15, description: "15% de bienvenue" },
  { code: "FELINO20", type: "fixed", value: 20, description: "20€ de réduction immédiate" },
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Livraison Standard",
    description: "3 à 5 jours ouvrés",
    price: 4.9,
  },
  {
    id: "express",
    label: "Livraison Express",
    description: "24 à 48h",
    price: 9.9,
  },
  {
    id: "pickup",
    label: "Retrait en boutique",
    description: "Disponible sous 24h — Paris, 8ème",
    price: 0,
  },
];

export const FREE_SHIPPING_THRESHOLD = 150;
