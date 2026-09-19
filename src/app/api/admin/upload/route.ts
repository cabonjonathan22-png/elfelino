import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request): Promise<NextResponse> {
  const store = await cookies();
  const accessCodeId = await verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
  if (!accessCodeId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      // Product media lives in a dedicated *public* Blob store — separate
      // from the private store used for the JSON data — since a private
      // store's browser-upload endpoint doesn't allow the cross-origin PUT
      // that client uploads rely on.
      token: process.env.MEDIA_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: true,
        access: "public",
        maximumSizeInBytes: 100 * 1024 * 1024, // 100MB, generous for short product videos
      }),
      onUploadCompleted: async () => {
        // No-op: the admin form receives the blob URL directly from the
        // client upload and attaches it to the product on save.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
