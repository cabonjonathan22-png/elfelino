// HMAC session tokens signed with the Web Crypto API so this module works
// identically in the Edge middleware runtime and in Node (Server Actions,
// Route Handlers) without relying on the Node-only `crypto` module.

const SECRET = process.env.ADMIN_SESSION_SECRET || "maison-dev-secret-change-in-production";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h session

export const ADMIN_COOKIE_NAME = "maison_admin_session";
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(sig);
}

export async function createSessionToken(accessCodeId: string): Promise<string> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${accessCodeId}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [accessCodeId, expiresAt, signature] = parts;

  const expected = await sign(`${accessCodeId}.${expiresAt}`);
  if (expected !== signature) return null;
  if (Date.now() > Number(expiresAt)) return null;

  return accessCodeId;
}
