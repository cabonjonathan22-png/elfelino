"use server";

import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/db";
import type { CartItem, Order, OrderCustomer } from "@/lib/types";

interface PlaceOrderInput {
  customer: OrderCustomer;
  items: CartItem[];
  shippingMethodId: string;
  shippingCost: number;
  paymentMethod: "card" | "paypal";
  promoCode?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export async function placeOrderAction(input: PlaceOrderInput): Promise<{ id: string }> {
  const id = `MAISON-${Math.floor(100000 + Math.random() * 900000)}`;

  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    customer: input.customer,
    items: input.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      swatch: item.swatch,
      tone: item.tone,
    })),
    shippingMethodId: input.shippingMethodId,
    shippingCost: input.shippingCost,
    paymentMethod: input.paymentMethod,
    promoCode: input.promoCode,
    subtotal: input.subtotal,
    discount: input.discount,
    total: input.total,
    status: "pending",
  };

  await createOrder(order);
  revalidatePath("/", "layout");
  revalidatePath("/admin/orders");

  return { id };
}
