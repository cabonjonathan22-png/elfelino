import { get, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import type { AccessCode, Brand, Order, OrderStatus, PromoCode, Product, ShippingMethod } from "@/lib/types";
import { PRODUCTS as SEED_PRODUCTS } from "@/data/products";
import { BRANDS as SEED_BRANDS } from "@/data/brands";
import { PROMO_CODES as SEED_PROMO_CODES, SHIPPING_METHODS as SEED_SHIPPING_METHODS } from "@/data/commerce";

// Vercel Blob-backed store standing in for a real database. Serverless
// functions don't share a writable local filesystem across invocations,
// so the storefront and the admin space both read/write this single JSON
// blob as their shared source of truth.

const BLOB_PATHNAME = "maison/db.json";

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

async function writeDb(data: DbShape): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readDb(): Promise<DbShape> {
  const result = await get(BLOB_PATHNAME, { access: "private", useCache: false }).catch(() => null);

  if (!result) {
    const seeded = seedDb();
    try {
      await writeDb(seeded);
    } catch {
      // Best-effort persistence. Build-time static generation runs many
      // page renders in parallel and may not have durable write access —
      // fall back to the in-memory seed so rendering still succeeds. A
      // real request at runtime will persist it on the next write.
    }
    return seeded;
  }

  const raw = await new Response(result.stream).text();
  const parsed = JSON.parse(raw) as Partial<DbShape>;
  // Defensive defaults in case the blob predates a field being added.
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

export async function getProducts(): Promise<Product[]> {
  return (await readDb()).products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await readDb()).products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await readDb()).products.find((p) => p.id === id);
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  return (await readDb()).products.filter((p) => p.brand === brand);
}

export async function getNewProducts(limit = 4): Promise<Product[]> {
  return (await readDb()).products.filter((p) => p.isNew).slice(0, limit);
}

export async function getLimitedProducts(limit = 4): Promise<Product[]> {
  return (await readDb()).products.filter((p) => p.isLimited).slice(0, limit);
}

export async function saveProduct(product: Product): Promise<void> {
  const db = await readDb();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.push(product);
  await writeDb(db);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await readDb();
  db.products = db.products.filter((p) => p.id !== id);
  await writeDb(db);
}

// ------------------------------------------------------------------ Brands

export async function getBrands(): Promise<Brand[]> {
  return (await readDb()).brands;
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  return (await readDb()).brands.find((b) => b.slug === slug);
}

export async function saveBrand(brand: Brand): Promise<void> {
  const db = await readDb();
  const idx = db.brands.findIndex((b) => b.slug === brand.slug);
  if (idx >= 0) db.brands[idx] = brand;
  await writeDb(db);
}

// ------------------------------------------------------------- Promo codes

export async function getPromoCodes(): Promise<PromoCode[]> {
  return (await readDb()).promoCodes;
}

export async function getPromoCode(code: string): Promise<PromoCode | undefined> {
  return (await readDb()).promoCodes.find((p) => p.code === code.trim().toUpperCase());
}

export async function savePromoCode(promo: PromoCode, previousCode?: string): Promise<void> {
  const db = await readDb();
  const idx = db.promoCodes.findIndex((p) => p.code === (previousCode ?? promo.code));
  if (idx >= 0) db.promoCodes[idx] = promo;
  else db.promoCodes.push(promo);
  await writeDb(db);
}

export async function deletePromoCode(code: string): Promise<void> {
  const db = await readDb();
  db.promoCodes = db.promoCodes.filter((p) => p.code !== code);
  await writeDb(db);
}

// -------------------------------------------------------------- Shipping

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  return (await readDb()).shippingMethods;
}

// ---------------------------------------------------------------- Orders

export async function getOrders(): Promise<Order[]> {
  return [...(await readDb()).orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readDb()).orders.find((o) => o.id === id);
}

export async function createOrder(order: Order): Promise<void> {
  const db = await readDb();

  // Decrement stock for each purchased size so the admin stock view and
  // storefront availability reflect real orders as they come in.
  for (const item of order.items) {
    const product = db.products.find((p) => p.slug === item.slug);
    const sizeEntry = product?.sizes.find((s) => s.size === item.size);
    if (sizeEntry) sizeEntry.stock = Math.max(0, sizeEntry.stock - item.quantity);
  }

  db.orders.push(order);
  await writeDb(db);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const db = await readDb();
  const order = db.orders.find((o) => o.id === id);
  if (order) order.status = status;
  await writeDb(db);
}

// ---------------------------------------------------------- Access codes

export async function getAccessCodes(): Promise<AccessCode[]> {
  return (await readDb()).accessCodes;
}

export async function getAccessCodeById(id: string): Promise<AccessCode | undefined> {
  return (await readDb()).accessCodes.find((a) => a.id === id);
}

export async function validateAccessCode(code: string): Promise<AccessCode | undefined> {
  const db = await readDb();
  const found = db.accessCodes.find(
    (a) => a.code === code.trim().toUpperCase() && !a.revoked
  );
  if (found) {
    found.lastUsedAt = new Date().toISOString();
    await writeDb(db);
  }
  return found;
}

function generateAccessCode(): string {
  const segment = () => randomUUID().split("-")[0].toUpperCase();
  return `MAISON-${segment()}`;
}

export async function createAccessCode(label: string): Promise<AccessCode> {
  const db = await readDb();
  const accessCode: AccessCode = {
    id: randomUUID(),
    label: label.trim() || "Sans nom",
    code: generateAccessCode(),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revoked: false,
  };
  db.accessCodes.push(accessCode);
  await writeDb(db);
  return accessCode;
}

export async function revokeAccessCode(id: string): Promise<void> {
  const db = await readDb();
  const found = db.accessCodes.find((a) => a.id === id);
  if (found) found.revoked = true;
  await writeDb(db);
}
