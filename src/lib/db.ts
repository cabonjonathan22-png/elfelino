import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AccessCode, Brand, Order, OrderStatus, PromoCode, Product, ShippingMethod } from "@/lib/types";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import { BRANDS as SEED_BRANDS } from "@/data/brands";
import { PROMO_CODES as SEED_PROMO_CODES, SHIPPING_METHODS as SEED_SHIPPING_METHODS } from "@/data/commerce";

// File-backed store standing in for a real database. Every admin
// mutation and every customer order is written here so the storefront
// and the admin space share one source of truth and survive restarts.

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface DbShape {
  products: Product[];
  brands: Brand[];
  promoCodes: PromoCode[];
  shippingMethods: ShippingMethod[];
  orders: Order[];
  accessCodes: AccessCode[];
}

function seedDb(): DbShape {
  return {
    products: SEED_PRODUCTS,
    brands: SEED_BRANDS,
    promoCodes: SEED_PROMO_CODES,
    shippingMethods: SEED_SHIPPING_METHODS,
    orders: [],
    accessCodes: [
      {
        id: randomUUID(),
        label: "Accès Fondateur",
        code: "MAISON-2026-FONDATEUR",
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        revoked: false,
      },
    ],
  };
}

function writeDb(data: DbShape): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function readDb(): DbShape {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = seedDb();
    writeDb(seeded);
    return seeded;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Partial<DbShape>;
  // Defensive defaults in case the file predates a field being added.
  return {
    products: parsed.products ?? SEED_PRODUCTS,
    brands: parsed.brands ?? SEED_BRANDS,
    promoCodes: parsed.promoCodes ?? SEED_PROMO_CODES,
    shippingMethods: parsed.shippingMethods ?? SEED_SHIPPING_METHODS,
    orders: parsed.orders ?? [],
    accessCodes: parsed.accessCodes ?? [],
  };
}

// ---------------------------------------------------------------- Products

export function getProducts(): Product[] {
  return readDb().products;
}

export function getProduct(slug: string): Product | undefined {
  return readDb().products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return readDb().products.find((p) => p.id === id);
}

export function getProductsByBrand(brand: string): Product[] {
  return readDb().products.filter((p) => p.brand === brand);
}

export function getNewProducts(limit = 4): Product[] {
  return readDb().products.filter((p) => p.isNew).slice(0, limit);
}

export function getLimitedProducts(limit = 4): Product[] {
  return readDb().products.filter((p) => p.isLimited).slice(0, limit);
}

export function saveProduct(product: Product): void {
  const db = readDb();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.push(product);
  writeDb(db);
}

export function deleteProduct(id: string): void {
  const db = readDb();
  db.products = db.products.filter((p) => p.id !== id);
  writeDb(db);
}

// ------------------------------------------------------------------ Brands

export function getBrands(): Brand[] {
  return readDb().brands;
}

export function getBrand(slug: string): Brand | undefined {
  return readDb().brands.find((b) => b.slug === slug);
}

export function saveBrand(brand: Brand): void {
  const db = readDb();
  const idx = db.brands.findIndex((b) => b.slug === brand.slug);
  if (idx >= 0) db.brands[idx] = brand;
  writeDb(db);
}

// ------------------------------------------------------------- Promo codes

export function getPromoCodes(): PromoCode[] {
  return readDb().promoCodes;
}

export function getPromoCode(code: string): PromoCode | undefined {
  return readDb().promoCodes.find((p) => p.code === code.trim().toUpperCase());
}

export function savePromoCode(promo: PromoCode, previousCode?: string): void {
  const db = readDb();
  const idx = db.promoCodes.findIndex((p) => p.code === (previousCode ?? promo.code));
  if (idx >= 0) db.promoCodes[idx] = promo;
  else db.promoCodes.push(promo);
  writeDb(db);
}

export function deletePromoCode(code: string): void {
  const db = readDb();
  db.promoCodes = db.promoCodes.filter((p) => p.code !== code);
  writeDb(db);
}

// -------------------------------------------------------------- Shipping

export function getShippingMethods(): ShippingMethod[] {
  return readDb().shippingMethods;
}

// ---------------------------------------------------------------- Orders

export function getOrders(): Order[] {
  return [...readDb().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(id: string): Order | undefined {
  return readDb().orders.find((o) => o.id === id);
}

export function createOrder(order: Order): void {
  const db = readDb();

  // Decrement stock for each purchased size so the admin stock view and
  // storefront availability reflect real orders as they come in.
  for (const item of order.items) {
    const product = db.products.find((p) => p.slug === item.slug);
    const sizeEntry = product?.sizes.find((s) => s.size === item.size);
    if (sizeEntry) sizeEntry.stock = Math.max(0, sizeEntry.stock - item.quantity);
  }

  db.orders.push(order);
  writeDb(db);
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const db = readDb();
  const order = db.orders.find((o) => o.id === id);
  if (order) order.status = status;
  writeDb(db);
}

// ---------------------------------------------------------- Access codes

export function getAccessCodes(): AccessCode[] {
  return readDb().accessCodes;
}

export function getAccessCodeById(id: string): AccessCode | undefined {
  return readDb().accessCodes.find((a) => a.id === id);
}

export function validateAccessCode(code: string): AccessCode | undefined {
  const db = readDb();
  const found = db.accessCodes.find(
    (a) => a.code === code.trim().toUpperCase() && !a.revoked
  );
  if (found) {
    found.lastUsedAt = new Date().toISOString();
    writeDb(db);
  }
  return found;
}

function generateAccessCode(): string {
  const segment = () => randomUUID().split("-")[0].toUpperCase();
  return `MAISON-${segment()}`;
}

export function createAccessCode(label: string): AccessCode {
  const db = readDb();
  const accessCode: AccessCode = {
    id: randomUUID(),
    label: label.trim() || "Sans nom",
    code: generateAccessCode(),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revoked: false,
  };
  db.accessCodes.push(accessCode);
  writeDb(db);
  return accessCode;
}

export function revokeAccessCode(id: string): void {
  const db = readDb();
  const found = db.accessCodes.find((a) => a.id === id);
  if (found) found.revoked = true;
  writeDb(db);
}
