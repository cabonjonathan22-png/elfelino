"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAccessCode } from "@/lib/db";
import { createSessionToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code") || "").trim();
  const next = String(formData.get("next") || "/admin");

  const accessCode = await validateAccessCode(code);
  if (!accessCode) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken(accessCode.id);
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });

  redirect(next || "/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
