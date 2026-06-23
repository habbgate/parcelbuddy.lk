import { ok, fail, handler } from "@/lib/api";
import { uploadToImgBB, isStorageConfigured } from "@/lib/storage";

export const dynamic = "force-dynamic";
// Allow larger image payloads.
export const maxDuration = 30;

// POST /api/uploads — multipart form-data with field "file".
// Forwards the image to ImgBB (key stays server-side) and returns the URL.
export const POST = handler(async (req) => {
  if (!isStorageConfigured()) {
    return fail("Image hosting is not configured. Set IMGBB_API_KEY.", 503, {
      storageNotConfigured: true,
    });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return fail("No file provided", 400);
  }
  if (!file.type?.startsWith("image/")) {
    return fail("Only image files are allowed", 415);
  }
  // ImgBB free tier limit is 32MB; guard at 16MB.
  if (file.size > 16 * 1024 * 1024) {
    return fail("Image is too large (max 16MB)", 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToImgBB(buffer, file.name);

  return ok({ url, publicUrl: url });
});

