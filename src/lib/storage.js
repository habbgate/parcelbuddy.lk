import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const region = process.env.AWS_REGION || "ap-south-1";
const bucket = process.env.AWS_S3_BUCKET;

let s3 = null;
function getClient() {
  if (s3) return s3;
  if (!process.env.AWS_ACCESS_KEY_ID || !bucket) return null;
  s3 = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.AWS_S3_ENDPOINT, // for R2 compatibility
  });
  return s3;
}

export function isStorageConfigured() {
  return !!process.env.IMGBB_API_KEY || !!(process.env.AWS_ACCESS_KEY_ID && bucket);
}

/**
 * Upload an image buffer to ImgBB and return the hosted public URL.
 * @param {Buffer} buffer raw image bytes
 * @param {string} [name] optional file name
 * @returns {Promise<string>} hosted image URL
 */
export async function uploadToImgBB(buffer, name) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error("IMGBB_API_KEY is not configured");

  const form = new FormData();
  form.append("image", buffer.toString("base64"));
  if (name) form.append("name", name.replace(/\.[^.]+$/, ""));

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      body: form,
    }
  );
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.success) {
    const msg = data?.error?.message || "ImgBB upload failed";
    const err = new Error(
      /invalid api/i.test(msg)
        ? "ImgBB rejected the API key. Check IMGBB_API_KEY in your .env (get one at https://api.imgbb.com/)."
        : msg
    );
    err.status = 502;
    throw err;
  }
  // display_url is the direct CDN image link; url is the viewer-friendly link.
  return data.data.display_url || data.data.url;
}

function publicUrl(key) {
  const base = process.env.AWS_S3_PUBLIC_URL;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Create a presigned PUT URL for direct browser upload.
 * @returns {Promise<{uploadUrl: string, publicUrl: string, key: string}>}
 */
export async function createPresignedUpload(folder, contentType) {
  const client = getClient();
  if (!client) throw new Error("File storage is not configured");

  const ext = (contentType?.split("/")[1] || "bin").replace(/[^a-z0-9]/gi, "");
  const key = `${folder}/${Date.now()}-${nanoid(10)}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  return { uploadUrl, publicUrl: publicUrl(key), key };
}
