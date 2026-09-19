// Core domain types shared across the app.

export type BrandSlug = "el-felino" | "rshadow" | "tbe";

export interface BrandValue {
  title: string;
  description: string;
}

export interface Brand {
  slug: BrandSlug;
  name: string;
  shortName: string;
  tagline: string;
  positioning: string;
  description: string;
  story: string[];
  values: BrandValue[];
  heroLabel: string;
}

export type ProductCategory =
  | "tshirt-homme"
  | "tshirt-femme"
  | "hoodie"
  | "jogging"
  | "ensemble"
  | "legging"
  | "brassiere"
  | "casquette"
  | "accessoire"
  | "drop";

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  "tshirt-homme": "T-shirt Homme",
  "tshirt-femme": "T-shirt Femme",
  hoodie: "Hoodie",
  jogging: "Jogging / Ensemble",
  ensemble: "Ensemble",
  legging: "Legging",
  brassiere: "Brassière",
  casquette: "Casquette & Accessoires",
  accessoire: "Accessoire",
  drop: "Collection limitée",
};

export interface ProductSizeStock {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  brand: BrandSlug;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  currency: "EUR";
  description: string;
  composition: string;
  care: string;
  sizes: ProductSizeStock[];
  isNew?: boolean;
  isLimited?: boolean;
  tone: "light" | "dark";
  swatch: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: BrandSlug;
  price: number;
  size: string;
  quantity: number;
  swatch: number;
  tone: "light" | "dark";
}

export interface PromoCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
}

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  price: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export interface OrderItem {
  slug: string;
  name: string;
  brand: BrandSlug;
  size: string;
  quantity: number;
  price: number;
  swatch: number;
  tone: "light" | "dark";
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  shippingMethodId: string;
  shippingCost: number;
  paymentMethod: "card" | "paypal";
  promoCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
}

export interface AccessCode {
  id: string;
  label: string;
  code: string;
  createdAt: string;
  lastUsedAt: string | null;
  revoked: boolean;
}
