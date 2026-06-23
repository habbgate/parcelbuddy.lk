import { customAlphabet } from "nanoid";

// Exclude ambiguous characters: 0, O, I, 1, L.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generateSuffix = customAlphabet(ALPHABET, 4);
const generateToken = customAlphabet(
  "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
  32
);

/**
 * Generate a tracking code like "PB-8X4K".
 */
export function generateTrackingCode() {
  return `PB-${generateSuffix()}`;
}

/**
 * Generate a unique tracking code, retrying on collision.
 * @param {import('mongoose').Model} ParcelRequest
 */
export async function generateUniqueTrackingCode(ParcelRequest) {
  for (let i = 0; i < 10; i++) {
    const code = generateTrackingCode();
    const exists = await ParcelRequest.exists({ trackingCode: code });
    if (!exists) return code;
  }
  // Extremely unlikely fallback with extra entropy.
  return `PB-${generateSuffix()}${generateSuffix()}`;
}

/**
 * Generate an opaque token for guest sender delivery confirmation.
 */
export function generateConfirmToken() {
  return generateToken();
}

