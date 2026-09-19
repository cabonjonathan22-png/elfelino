import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPromoCode } from "@/lib/db";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  const promo = code ? await getPromoCode(code) : undefined;

  if (!promo) {
    return NextResponse.json({ valid: false, message: "Code promo invalide." });
  }

  return NextResponse.json({ valid: true, promo });
}
